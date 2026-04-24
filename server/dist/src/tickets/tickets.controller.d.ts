import { TicketsService } from './tickets.service';
import { ValidateTicketDto } from './dto/validate-ticket.dto';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    download(id: string, req: any): Promise<{
        id: string;
        uuid_secreto: string;
        estado: import("./entities/ticket.entity").TicketStatus.VENDIDO | import("./entities/ticket.entity").TicketStatus.USADO;
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
    validate(validateDto: ValidateTicketDto): Promise<{
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
