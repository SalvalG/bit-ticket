import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Event } from '../../events/entities/event.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';

@Entity('zones')
export class Zone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  evento_id: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'int' })
  capacidad_total: number;

  @Column({ type: 'int' })
  asientos_disponibles: number;

  // Relaciones
  @ManyToOne(() => Event, (event) => event.zonas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'evento_id' })
  evento: Event;

  @OneToMany(() => Ticket, (ticket) => ticket.zona)
  boletos: Ticket[];
}
