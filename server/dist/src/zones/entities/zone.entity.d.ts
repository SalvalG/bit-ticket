import { Event } from '../../events/entities/event.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
export declare class Zone {
    id: string;
    evento_id: string;
    nombre: string;
    precio: number;
    capacidad_total: number;
    asientos_disponibles: number;
    evento: Event;
    boletos: Ticket[];
}
