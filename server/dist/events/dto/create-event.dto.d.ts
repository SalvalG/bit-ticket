export declare class CreateZoneDto {
    nombre: string;
    precio: number;
    capacidad_total: number;
}
export declare class CreateEventDto {
    nombre: string;
    descripcion?: string;
    fecha: string;
    ubicacion: string;
    imagen_url?: string;
    zonas: CreateZoneDto[];
}
