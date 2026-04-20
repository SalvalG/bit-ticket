import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Payment } from '../../payments/entities/payment.entity';

/**
 * Estados del ciclo de vida de una orden de compra.
 */
export enum OrderStatus {
  PENDIENTE_PAGO = 'PENDIENTE_PAGO',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
  REEMBOLSADA = 'REEMBOLSADA',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  usuario_id: string;

  @CreateDateColumn({ type: 'timestamp' })
  fecha_compra: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto_total: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDIENTE_PAGO,
  })
  estado: OrderStatus;

  @Column({ type: 'varchar', length: 50, nullable: true })
  cupon_aplicado: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  descuento_pct: number;

  // Relaciones
  @ManyToOne(() => User, (user) => user.ordenes)
  @JoinColumn({ name: 'usuario_id' })
  usuario: User;

  @OneToMany(() => Ticket, (ticket) => ticket.compra)
  boletos: Ticket[];

  @OneToOne(() => Payment, (payment) => payment.orden)
  pago: Payment;
}
