import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Ticket } from '../tickets/entities/ticket.entity';
import { Zone } from '../zones/entities/zone.entity';
import { Payment } from '../payments/entities/payment.entity';
import { Coupon } from '../coupons/entities/coupon.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Ticket, Zone, Payment, Coupon])],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
