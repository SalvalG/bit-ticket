import { IsUUID, IsNotEmpty } from 'class-validator';

export class ValidateTicketDto {
  @IsUUID('4', { message: 'El UUID del boleto debe ser válido.' })
  @IsNotEmpty({ message: 'El UUID secreto del boleto es obligatorio.' })
  uuid_secreto: string;
}
