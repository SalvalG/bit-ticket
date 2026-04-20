import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Zone } from '../../zones/entities/zone.entity';
import { Order } from '../../orders/entities/order.entity';

/**
 * Estados del ciclo de vida de un boleto.
 */
export enum TicketStatus {
  DISPONIBLE = 'DISPONIBLE',
  RESERVADO = 'RESERVADO',
  VENDIDO = 'VENDIDO',
  USADO = 'USADO',
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  zona_id: string;

  @Column({ type: 'uuid', nullable: true })
  compra_id: string;

  @Column({ type: 'uuid', unique: true })
  uuid_secreto: string;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.DISPONIBLE,
  })
  estado: TicketStatus;

  @Column({ type: 'timestamp', nullable: true })
  reservado_hasta: Date;

  // Relaciones
  @ManyToOne(() => Zone, (zone) => zone.boletos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'zona_id' })
  zona: Zone;

  @ManyToOne(() => Order, (order) => order.boletos, { nullable: true })
  @JoinColumn({ name: 'compra_id' })
  compra: Order;
}
