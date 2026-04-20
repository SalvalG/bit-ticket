import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';

/**
 * Roles disponibles en el sistema.
 * ADMIN: Gestión completa de eventos.
 * STAFF: Validación de boletos en puerta.
 * CLIENTE: Compra de boletos.
 */
export enum UserRole {
  ADMIN = 'ADMIN',
  STAFF = 'STAFF',
  CLIENTE = 'CLIENTE',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENTE,
  })
  rol: UserRole;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  // Relaciones
  @OneToMany(() => Order, (order) => order.usuario)
  ordenes: Order[];
}
