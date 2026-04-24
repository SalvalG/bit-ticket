import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    findAll(fecha?: string, ubicacion?: string, nombre?: string): Promise<import("./entities/event.entity").Event[]>;
    findOne(id: string): Promise<import("./entities/event.entity").Event>;
    create(createEventDto: CreateEventDto): Promise<import("./entities/event.entity").Event>;
    update(id: string, updateEventDto: UpdateEventDto): Promise<import("./entities/event.entity").Event>;
    cancel(id: string, motivo: string): Promise<{
        event: import("./entities/event.entity").Event;
        ordenes_afectadas: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
