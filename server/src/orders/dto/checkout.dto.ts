import {
  IsUUID,
  IsInt,
  Min,
  IsArray,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TicketSelectionDto {
  @IsUUID('4', { message: 'El ID de zona debe ser un UUID válido.' })
  zona_id: string;

  @IsInt({ message: 'La cantidad debe ser un número entero.' })
  @Min(1, { message: 'Debes seleccionar al menos 1 boleto.' })
  cantidad: number;
}

export class CheckoutDto {
  @IsUUID('4', { message: 'El ID de evento debe ser un UUID válido.' })
  @IsNotEmpty()
  evento_id: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketSelectionDto)
  boletos: TicketSelectionDto[];
}
