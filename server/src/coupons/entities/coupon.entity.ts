import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  codigo: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  descuento_pct: number;

  @Column({ type: 'int' })
  limite_usos: number;

  @Column({ type: 'int', default: 0 })
  usos_actuales: number;

  @Column({ type: 'timestamp' })
  valido_hasta: Date;
}
