import { Zone } from '../../zones/entities/zone.entity';
import { Order } from '../../orders/entities/order.entity';
export declare enum TicketStatus {
    DISPONIBLE = "DISPONIBLE",
    RESERVADO = "RESERVADO",
    VENDIDO = "VENDIDO",
    USADO = "USADO"
}
export declare class Ticket {
    id: string;
    zona_id: string;
    compra_id: string;
    uuid_secreto: string;
    estado: TicketStatus;
    reservado_hasta: Date;
    zona: Zone;
    compra: Order;
}
