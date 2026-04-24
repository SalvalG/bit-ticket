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
export declare class OrdersService {
    private readonly ordersRepository;
    private readonly ticketsRepository;
    private readonly zonesRepository;
    private readonly paymentsRepository;
    private readonly couponsRepository;
    private readonly dataSource;
    private readonly configService;
    constructor(ordersRepository: Repository<Order>, ticketsRepository: Repository<Ticket>, zonesRepository: Repository<Zone>, paymentsRepository: Repository<Payment>, couponsRepository: Repository<Coupon>, dataSource: DataSource, configService: ConfigService);
    checkout(userId: string, checkoutDto: CheckoutDto): Promise<{
        message: string;
        orden: {
            id: string;
            monto_total: number;
            estado: OrderStatus;
            expira_en_minutos: number;
        };
        boletos: {
            id: string;
            zona_id: string;
            estado: TicketStatus;
        }[];
    }>;
    applyCoupon(userId: string, dto: ApplyCouponDto): Promise<{
        message: string;
        descuento_pct: number;
        monto_original: number;
        monto_final: number;
    }>;
    confirmOrder(userId: string, dto: ConfirmOrderDto): Promise<{
        message: string;
        orden: {
            id: string;
            estado: OrderStatus.COMPLETADA;
            monto_total: number;
        };
        boletos: {
            id: string;
            uuid_secreto: string;
            estado: TicketStatus;
        }[];
    }>;
    getHistory(userId: string): Promise<{
        id: string;
        fecha_compra: Date;
        monto_total: number;
        estado: OrderStatus;
        cupon_aplicado: string;
        pago: {
            metodo_pago: string;
            estado_pago: PaymentStatus;
        } | null;
        boletos: {
            id: string;
            uuid_secreto: string;
            estado: TicketStatus;
            zona: {
                nombre: string;
                precio: number;
            } | null;
            evento: {
                nombre: string;
                fecha: Date;
                ubicacion: string;
            } | null;
        }[];
    }[]>;
}
