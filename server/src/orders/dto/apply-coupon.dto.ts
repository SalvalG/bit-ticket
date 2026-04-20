import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class ApplyCouponDto {
  @IsUUID('4', { message: 'El ID de orden debe ser un UUID válido.' })
  @IsNotEmpty()
  orden_id: string;

  @IsString()
  @IsNotEmpty({ message: 'El código del cupón es obligatorio.' })
  codigo: string;
}
