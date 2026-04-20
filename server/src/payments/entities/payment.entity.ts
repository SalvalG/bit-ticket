import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

/**
 * Estados del pago procesado por la pasarela.
 */
export enum PaymentStatus {
  EXITOSO = 'EXITOSO',
  RECHAZADO = 'RECHAZADO',
  REEMBOLSADO = 'REEMBOLSADO',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  orden_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  transaccion_id: string;

  @Column({ type: 'varchar', length: 100 })
  metodo_pago: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.EXITOSO,
  })
  estado_pago: PaymentStatus;

  // Relaciones
  @OneToOne(() => Order, (order) => order.pago)
  @JoinColumn({ name: 'orden_id' })
  orden: Order;
}
