import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { Ticket, TicketStatus } from '../tickets/entities/ticket.entity';
import { Zone } from '../zones/entities/zone.entity';
import { Payment, PaymentStatus } from '../payments/entities/payment.entity';
import { Coupon } from '../coupons/entities/coupon.entity';
import { CheckoutDto } from './dto/checkout.dto';
import { ConfirmOrderDto } from './dto/confirm-order.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Ticket)
    private readonly ticketsRepository: Repository<Ticket>,
    @InjectRepository(Zone)
    private readonly zonesRepository: Repository<Zone>,
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    @InjectRepository(Coupon)
    private readonly couponsRepository: Repository<Coupon>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  /**
   * UC3: Checkout - Seleccionar boletos y reservar temporalmente.
   * Usa una transacción de base de datos para prevenir race conditions.
   */
  async checkout(userId: string, checkoutDto: CheckoutDto) {
    const reservationMinutes = this.configService.get<number>(
      'RESERVATION_TIMEOUT_MINUTES',
      10,
    );

    return this.dataSource.transaction(async (manager) => {
      let montoTotal = 0;
      const ticketsReservados: Ticket[] = [];

      for (const seleccion of checkoutDto.boletos) {
        const zona = await manager.findOne(Zone, {
          where: { id: seleccion.zona_id },
        });

        if (!zona) {
          throw new NotFoundException(
            `Zona con ID ${seleccion.zona_id} no encontrada.`,
          );
        }

        // Buscar boletos disponibles con bloqueo pesimista
        const boletosDisponibles = await manager.find(Ticket, {
          where: {
            zona_id: seleccion.zona_id,
            estado: TicketStatus.DISPONIBLE,
          },
          take: seleccion.cantidad,
          lock: { mode: 'pessimistic_write' },
        });

        if (boletosDisponibles.length < seleccion.cantidad) {
          throw new BadRequestException(
            `No hay suficientes boletos en la zona "${zona.nombre}". Disponibles: ${boletosDisponibles.length}.`,
          );
        }

        // Reservar boletos temporalmente
        const reservaExpira = new Date();
        reservaExpira.setMinutes(reservaExpira.getMinutes() + reservationMinutes);

        for (const boleto of boletosDisponibles) {
          boleto.estado = TicketStatus.RESERVADO;
          boleto.reservado_hasta = reservaExpira;
          ticketsReservados.push(boleto);
        }
        await manager.save(Ticket, boletosDisponibles);

        // Decrementar asientos disponibles atómicamente
        await manager
          .createQueryBuilder()
          .update(Zone)
          .set({ asientos_disponibles: () => `asientos_disponibles - ${seleccion.cantidad}` })
          .where('id = :id', { id: seleccion.zona_id })
          .execute();

        montoTotal += Number(zona.precio) * seleccion.cantidad;
      }

      // Crear la orden
      const order = manager.create(Order, {
        usuario_id: userId,
        monto_total: montoTotal,
        estado: OrderStatus.PENDIENTE_PAGO,
      });
      const savedOrder = await manager.save(Order, order);

      // Vincular boletos a la orden
      for (const boleto of ticketsReservados) {
        boleto.compra_id = savedOrder.id;
      }
      await manager.save(Ticket, ticketsReservados);

      return {
        message: 'Boletos reservados exitosamente.',
        orden: {
          id: savedOrder.id,
          monto_total: savedOrder.monto_total,
          estado: savedOrder.estado,
          expira_en_minutos: reservationMinutes,
        },
        boletos: ticketsReservados.map((t) => ({
          id: t.id,
          zona_id: t.zona_id,
          estado: t.estado,
        })),
      };
    });
  }

  /**
   * UC8: Aplicar cupón de descuento a una orden pendiente.
   */
  async applyCoupon(userId: string, dto: ApplyCouponDto) {
    const order = await this.ordersRepository.findOne({
      where: { id: dto.orden_id, usuario_id: userId },
    });

    if (!order) throw new NotFoundException('Orden no encontrada.');
    if (order.estado !== OrderStatus.PENDIENTE_PAGO) {
      throw new BadRequestException('Solo se pueden aplicar cupones a órdenes pendientes.');
    }
    if (order.cupon_aplicado) {
      throw new BadRequestException('Ya se ha aplicado un cupón a esta orden.');
    }

    const coupon = await this.couponsRepository.findOne({ where: { codigo: dto.codigo } });
    if (!coupon) throw new BadRequestException('El código de cupón es inválido.');
    if (new Date() > new Date(coupon.valido_hasta)) {
      throw new BadRequestException('El cupón ha expirado.');
    }
    if (coupon.usos_actuales >= coupon.limite_usos) {
      throw new BadRequestException('El cupón ha alcanzado su límite de usos.');
    }

    const descuento = Number(coupon.descuento_pct);
    const montoOriginal = Number(order.monto_total);
    const montoFinal = Math.round(montoOriginal * (1 - descuento / 100) * 100) / 100;

    order.cupon_aplicado = dto.codigo;
    order.descuento_pct = descuento;
    order.monto_total = montoFinal;
    await this.ordersRepository.save(order);

    coupon.usos_actuales += 1;
    await this.couponsRepository.save(coupon);

    return { message: 'Cupón aplicado.', descuento_pct: descuento, monto_original: montoOriginal, monto_final: montoFinal };
  }

  /**
   * UC3: Confirmar pago y consolidar la venta.
   */
  async confirmOrder(userId: string, dto: ConfirmOrderDto) {
    const order = await this.ordersRepository.findOne({
      where: { id: dto.orden_id, usuario_id: userId },
      relations: ['boletos'],
    });

    if (!order) throw new NotFoundException('Orden no encontrada.');
    if (order.estado !== OrderStatus.PENDIENTE_PAGO) {
      throw new BadRequestException('Esta orden ya fue procesada o cancelada.');
    }

    const expirado = order.boletos.find((b) => b.reservado_hasta && new Date() > b.reservado_hasta);
    if (expirado) {
      throw new BadRequestException('La reserva ha expirado. Inicia el proceso nuevamente.');
    }

    const payment = this.paymentsRepository.create({
      orden_id: order.id,
      transaccion_id: dto.transaccion_id,
      metodo_pago: dto.metodo_pago,
      estado_pago: PaymentStatus.EXITOSO,
    });
    await this.paymentsRepository.save(payment);

    order.estado = OrderStatus.COMPLETADA;
    await this.ordersRepository.save(order);

    for (const boleto of order.boletos) {
      boleto.estado = TicketStatus.VENDIDO;
      boleto.reservado_hasta = null as any;
    }
    await this.ticketsRepository.save(order.boletos);

    return {
      message: '¡Compra exitosa!',
      orden: { id: order.id, estado: order.estado, monto_total: order.monto_total },
      boletos: order.boletos.map((b) => ({ id: b.id, uuid_secreto: b.uuid_secreto, estado: b.estado })),
    };
  }

  /**
   * UC7: Historial de compras del usuario.
   */
  async getHistory(userId: string) {
    const orders = await this.ordersRepository.find({
      where: { usuario_id: userId },
      relations: ['boletos', 'boletos.zona', 'boletos.zona.evento', 'pago'],
      order: { fecha_compra: 'DESC' },
    });

    return orders.map((o) => ({
      id: o.id,
      fecha_compra: o.fecha_compra,
      monto_total: o.monto_total,
      estado: o.estado,
      cupon_aplicado: o.cupon_aplicado,
      pago: o.pago ? { metodo_pago: o.pago.metodo_pago, estado_pago: o.pago.estado_pago } : null,
      boletos: o.boletos.map((b) => ({
        id: b.id,
        uuid_secreto: b.uuid_secreto,
        estado: b.estado,
        zona: b.zona ? { nombre: b.zona.nombre, precio: b.zona.precio } : null,
        evento: b.zona?.evento ? { nombre: b.zona.evento.nombre, fecha: b.zona.evento.fecha, ubicacion: b.zona.evento.ubicacion } : null,
      })),
    }));
  }
}
