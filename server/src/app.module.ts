import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { ZonesModule } from './zones/zones.module';
import { OrdersModule } from './orders/orders.module';
import { TicketsModule } from './tickets/tickets.module';
import { PaymentsModule } from './payments/payments.module';
import { CouponsModule } from './coupons/coupons.module';

@Module({
  imports: [
    // Variables de entorno globales
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Conexión a PostgreSQL con TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get<string>('DB_USERNAME', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'bit_ticket'),
        autoLoadEntities: true,
        synchronize: true, // Solo en desarrollo, usar migrations en producción
      }),
    }),

    // Módulos de la aplicación
    AuthModule,
    UsersModule,
    EventsModule,
    ZonesModule,
    OrdersModule,
    TicketsModule,
    PaymentsModule,
    CouponsModule,
  ],
})
export class AppModule {}
