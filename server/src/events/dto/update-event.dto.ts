import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateEventDto {
  @IsString()
  @IsOptional()
  nombre?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsDateString()
  @IsOptional()
  fecha?: string;

  @IsString()
  @IsOptional()
  ubicacion?: string;

  @IsString()
  @IsOptional()
  imagen_url?: string;
}
