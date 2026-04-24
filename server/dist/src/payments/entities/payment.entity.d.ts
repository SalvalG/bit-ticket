import { Order } from '../../orders/entities/order.entity';
export declare enum PaymentStatus {
    EXITOSO = "EXITOSO",
    RECHAZADO = "RECHAZADO",
    REEMBOLSADO = "REEMBOLSADO"
}
export declare class Payment {
    id: string;
    orden_id: string;
    transaccion_id: string;
    metodo_pago: string;
    estado_pago: PaymentStatus;
    orden: Order;
}
