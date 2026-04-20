import { Repository } from 'typeorm';
import { Zone } from './entities/zone.entity';
export declare class ZonesService {
    private readonly zonesRepository;
    constructor(zonesRepository: Repository<Zone>);
    findByEventId(eventoId: string): Promise<Zone[]>;
    findById(id: string): Promise<Zone | null>;
    decrementAvailableSeats(zoneId: string, cantidad: number): Promise<boolean>;
    incrementAvailableSeats(zoneId: string, cantidad: number): Promise<void>;
}
