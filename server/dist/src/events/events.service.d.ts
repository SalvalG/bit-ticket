import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { Zone } from '../zones/entities/zone.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
export declare class EventsService {
    private readonly eventsRepository;
    private readonly zonesRepository;
    private readonly ticketsRepository;
    constructor(eventsRepository: Repository<Event>, zonesRepository: Repository<Zone>, ticketsRepository: Repository<Ticket>);
    findAll(filters?: {
        fecha?: string;
        ubicacion?: string;
        nombre?: string;
    }): Promise<Event[]>;
    findOne(id: string): Promise<Event>;
    create(createEventDto: CreateEventDto): Promise<Event>;
    update(id: string, updateEventDto: UpdateEventDto): Promise<Event>;
    cancel(id: string, motivo: string): Promise<{
        event: Event;
        ordenes_afectadas: number;
    }>;
}
