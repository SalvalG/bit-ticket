import { IsUUID, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmOrderDto {
  @IsUUID('4', { message: 'El ID de orden debe ser un UUID válido.' })
  @IsNotEmpty()
  orden_id: string;

  @IsString()
  @IsNotEmpty({ message: 'El método de pago es obligatorio.' })
  metodo_pago: string;

  @IsString()
  @IsNotEmpty({ message: 'El ID de transacción es obligatorio.' })
  transaccion_id: string;
}
