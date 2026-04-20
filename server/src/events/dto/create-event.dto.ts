import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateZoneDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la zona es obligatorio.' })
  nombre: string;

  @IsNumber({}, { message: 'El precio debe ser un número.' })
  @Min(0, { message: 'El precio no puede ser negativo.' })
  precio: number;

  @IsInt({ message: 'La capacidad debe ser un número entero.' })
  @Min(1, { message: 'La capacidad debe ser al menos 1.' })
  capacidad_total: number;
}

export class CreateEventDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del evento es obligatorio.' })
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsDateString({}, { message: 'La fecha debe ser una fecha válida.' })
  @IsNotEmpty({ message: 'La fecha del evento es obligatoria.' })
  fecha: string;

  @IsString()
  @IsNotEmpty({ message: 'La ubicación es obligatoria.' })
  ubicacion: string;

  @IsString()
  @IsOptional()
  imagen_url?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateZoneDto)
  zonas: CreateZoneDto[];
}
