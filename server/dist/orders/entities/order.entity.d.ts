import { User } from '../../users/entities/user.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Payment } from '../../payments/entities/payment.entity';
export declare enum OrderStatus {
    PENDIENTE_PAGO = "PENDIENTE_PAGO",
    COMPLETADA = "COMPLETADA",
    CANCELADA = "CANCELADA",
    REEMBOLSADA = "REEMBOLSADA"
}
export declare class Order {
    id: string;
    usuario_id: string;
    fecha_compra: Date;
    monto_total: number;
    estado: OrderStatus;
    cupon_aplicado: string;
    descuento_pct: number;
    usuario: User;
    boletos: Ticket[];
    pago: Payment;
}
