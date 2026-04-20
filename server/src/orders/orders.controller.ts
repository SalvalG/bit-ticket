import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CheckoutDto } from './dto/checkout.dto';
import { ConfirmOrderDto } from './dto/confirm-order.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /** UC3: POST /api/orders/checkout — Reservar boletos */
  @Post('checkout')
  async checkout(@Request() req: any, @Body() checkoutDto: CheckoutDto) {
    return this.ordersService.checkout(req.user.id, checkoutDto);
  }

  /** UC8: POST /api/orders/apply-coupon — Aplicar cupón */
  @Post('apply-coupon')
  async applyCoupon(@Request() req: any, @Body() applyCouponDto: ApplyCouponDto) {
    return this.ordersService.applyCoupon(req.user.id, applyCouponDto);
  }

  /** UC3: POST /api/orders/confirm — Confirmar pago */
  @Post('confirm')
  async confirm(@Request() req: any, @Body() confirmDto: ConfirmOrderDto) {
    return this.ordersService.confirmOrder(req.user.id, confirmDto);
  }

  /** UC7: GET /api/orders/history — Historial de compras */
  @Get('history')
  async getHistory(@Request() req: any) {
    return this.ordersService.getHistory(req.user.id);
  }
}
