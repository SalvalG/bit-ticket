"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const ticket_entity_1 = require("../tickets/entities/ticket.entity");
const zone_entity_1 = require("../zones/entities/zone.entity");
const payment_entity_1 = require("../payments/entities/payment.entity");
const coupon_entity_1 = require("../coupons/entities/coupon.entity");
const config_1 = require("@nestjs/config");
let OrdersService = class OrdersService {
    constructor(ordersRepository, ticketsRepository, zonesRepository, paymentsRepository, couponsRepository, dataSource, configService) {
        this.ordersRepository = ordersRepository;
        this.ticketsRepository = ticketsRepository;
        this.zonesRepository = zonesRepository;
        this.paymentsRepository = paymentsRepository;
        this.couponsRepository = couponsRepository;
        this.dataSource = dataSource;
        this.configService = configService;
    }
    async checkout(userId, checkoutDto) {
        const reservationMinutes = this.configService.get('RESERVATION_TIMEOUT_MINUTES', 10);
        return this.dataSource.transaction(async (manager) => {
            let montoTotal = 0;
            const ticketsReservados = [];
            for (const seleccion of checkoutDto.boletos) {
                const zona = await manager.findOne(zone_entity_1.Zone, {
                    where: { id: seleccion.zona_id },
                });
                if (!zona) {
                    throw new common_1.NotFoundException(`Zona con ID ${seleccion.zona_id} no encontrada.`);
                }
                const boletosDisponibles = await manager.find(ticket_entity_1.Ticket, {
                    where: {
                        zona_id: seleccion.zona_id,
                        estado: ticket_entity_1.TicketStatus.DISPONIBLE,
                    },
                    take: seleccion.cantidad,
                    lock: { mode: 'pessimistic_write' },
                });
                if (boletosDisponibles.length < seleccion.cantidad) {
                    throw new common_1.BadRequestException(`No hay suficientes boletos en la zona "${zona.nombre}". Disponibles: ${boletosDisponibles.length}.`);
                }
                const reservaExpira = new Date();
                reservaExpira.setMinutes(reservaExpira.getMinutes() + reservationMinutes);
                for (const boleto of boletosDisponibles) {
                    boleto.estado = ticket_entity_1.TicketStatus.RESERVADO;
                    boleto.reservado_hasta = reservaExpira;
                    ticketsReservados.push(boleto);
                }
                await manager.save(ticket_entity_1.Ticket, boletosDisponibles);
                await manager
                    .createQueryBuilder()
                    .update(zone_entity_1.Zone)
                    .set({ asientos_disponibles: () => `asientos_disponibles - ${seleccion.cantidad}` })
                    .where('id = :id', { id: seleccion.zona_id })
                    .execute();
                montoTotal += Number(zona.precio) * seleccion.cantidad;
            }
            const order = manager.create(order_entity_1.Order, {
                usuario_id: userId,
                monto_total: montoTotal,
                estado: order_entity_1.OrderStatus.PENDIENTE_PAGO,
            });
            const savedOrder = await manager.save(order_entity_1.Order, order);
            for (const boleto of ticketsReservados) {
                boleto.compra_id = savedOrder.id;
            }
            await manager.save(ticket_entity_1.Ticket, ticketsReservados);
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
    async applyCoupon(userId, dto) {
        const order = await this.ordersRepository.findOne({
            where: { id: dto.orden_id, usuario_id: userId },
        });
        if (!order)
            throw new common_1.NotFoundException('Orden no encontrada.');
        if (order.estado !== order_entity_1.OrderStatus.PENDIENTE_PAGO) {
            throw new common_1.BadRequestException('Solo se pueden aplicar cupones a órdenes pendientes.');
        }
        if (order.cupon_aplicado) {
            throw new common_1.BadRequestException('Ya se ha aplicado un cupón a esta orden.');
        }
        const coupon = await this.couponsRepository.findOne({ where: { codigo: dto.codigo } });
        if (!coupon)
            throw new common_1.BadRequestException('El código de cupón es inválido.');
        if (new Date() > new Date(coupon.valido_hasta)) {
            throw new common_1.BadRequestException('El cupón ha expirado.');
        }
        if (coupon.usos_actuales >= coupon.limite_usos) {
            throw new common_1.BadRequestException('El cupón ha alcanzado su límite de usos.');
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
    async confirmOrder(userId, dto) {
        const order = await this.ordersRepository.findOne({
            where: { id: dto.orden_id, usuario_id: userId },
            relations: ['boletos'],
        });
        if (!order)
            throw new common_1.NotFoundException('Orden no encontrada.');
        if (order.estado !== order_entity_1.OrderStatus.PENDIENTE_PAGO) {
            throw new common_1.BadRequestException('Esta orden ya fue procesada o cancelada.');
        }
        const expirado = order.boletos.find((b) => b.reservado_hasta && new Date() > b.reservado_hasta);
        if (expirado) {
            throw new common_1.BadRequestException('La reserva ha expirado. Inicia el proceso nuevamente.');
        }
        const payment = this.paymentsRepository.create({
            orden_id: order.id,
            transaccion_id: dto.transaccion_id,
            metodo_pago: dto.metodo_pago,
            estado_pago: payment_entity_1.PaymentStatus.EXITOSO,
        });
        await this.paymentsRepository.save(payment);
        order.estado = order_entity_1.OrderStatus.COMPLETADA;
        await this.ordersRepository.save(order);
        for (const boleto of order.boletos) {
            boleto.estado = ticket_entity_1.TicketStatus.VENDIDO;
            boleto.reservado_hasta = null;
        }
        await this.ticketsRepository.save(order.boletos);
        return {
            message: '¡Compra exitosa!',
            orden: { id: order.id, estado: order.estado, monto_total: order.monto_total },
            boletos: order.boletos.map((b) => ({ id: b.id, uuid_secreto: b.uuid_secreto, estado: b.estado })),
        };
    }
    async getHistory(userId) {
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(ticket_entity_1.Ticket)),
    __param(2, (0, typeorm_1.InjectRepository)(zone_entity_1.Zone)),
    __param(3, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(4, (0, typeorm_1.InjectRepository)(coupon_entity_1.Coupon)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource,
        config_1.ConfigService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map