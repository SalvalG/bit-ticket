import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';
export declare class TicketsService {
    private readonly ticketsRepository;
    constructor(ticketsRepository: Repository<Ticket>);
    getTicketForDownload(ticketId: string, userId: string): Promise<{
        id: string;
        uuid_secreto: string;
        estado: TicketStatus.VENDIDO | TicketStatus.USADO;
        zona: {
            nombre: string;
            precio: number;
        };
        evento: {
            nombre: string;
            fecha: Date;
            ubicacion: string;
        };
    }>;
    validateTicket(uuidSecreto: string): Promise<{
        valido: boolean;
        mensaje: string;
        color: string;
        evento?: undefined;
        zona?: undefined;
    } | {
        valido: boolean;
        mensaje: string;
        color: string;
        evento: string;
        zona?: undefined;
    } | {
        valido: boolean;
        mensaje: string;
        color: string;
        evento: string;
        zona: string;
    }>;
}
