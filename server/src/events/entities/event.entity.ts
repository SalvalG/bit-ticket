import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Zone } from '../../zones/entities/zone.entity';

/**
 * Estados posibles de un evento.
 */
export enum EventStatus {
  ACTIVO = 'ACTIVO',
  CANCELADO = 'CANCELADO',
  FINALIZADO = 'FINALIZADO',
}

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'timestamp' })
  fecha: Date;

  @Column({ type: 'varchar', length: 255 })
  ubicacion: string;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.ACTIVO,
  })
  estado: EventStatus;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imagen_url: string;

  // Relaciones
  @OneToMany(() => Zone, (zone) => zone.evento, { cascade: true })
  zonas: Zone[];
}
