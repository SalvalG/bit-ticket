import { OrdersService } from './orders.service';
import { CheckoutDto } from './dto/checkout.dto';
import { ConfirmOrderDto } from './dto/confirm-order.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    checkout(req: any, checkoutDto: CheckoutDto): Promise<{
        message: string;
        orden: {
            id: string;
            monto_total: number;
            estado: import("./entities/order.entity").OrderStatus;
            expira_en_minutos: number;
        };
        boletos: {
            id: string;
            zona_id: string;
            estado: import("../tickets/entities/ticket.entity").TicketStatus;
        }[];
    }>;
    applyCoupon(req: any, applyCouponDto: ApplyCouponDto): Promise<{
        message: string;
        descuento_pct: number;
        monto_original: number;
        monto_final: number;
    }>;
    confirm(req: any, confirmDto: ConfirmOrderDto): Promise<{
        message: string;
        orden: {
            id: string;
            estado: import("./entities/order.entity").OrderStatus.COMPLETADA;
            monto_total: number;
        };
        boletos: {
            id: string;
            uuid_secreto: string;
            estado: import("../tickets/entities/ticket.entity").TicketStatus;
        }[];
    }>;
    getHistory(req: any): Promise<{
        id: string;
        fecha_compra: Date;
        monto_total: number;
        estado: import("./entities/order.entity").OrderStatus;
        cupon_aplicado: string;
        pago: {
            metodo_pago: string;
            estado_pago: import("../payments/entities/payment.entity").PaymentStatus;
        } | null;
        boletos: {
            id: string;
            uuid_secreto: string;
            estado: import("../tickets/entities/ticket.entity").TicketStatus;
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
