import { Order } from '../../orders/entities/order.entity';
export declare enum UserRole {
    ADMIN = "ADMIN",
    STAFF = "STAFF",
    CLIENTE = "CLIENTE"
}
export declare class User {
    id: string;
    nombre: string;
    email: string;
    password_hash: string;
    rol: UserRole;
    created_at: Date;
    ordenes: Order[];
}
