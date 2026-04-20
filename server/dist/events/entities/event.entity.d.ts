import { Zone } from '../../zones/entities/zone.entity';
export declare enum EventStatus {
    ACTIVO = "ACTIVO",
    CANCELADO = "CANCELADO",
    FINALIZADO = "FINALIZADO"
}
export declare class Event {
    id: string;
    nombre: string;
    descripcion: string;
    fecha: Date;
    ubicacion: string;
    estado: EventStatus;
    imagen_url: string;
    zonas: Zone[];
}
