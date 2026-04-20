import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
  ) {}

  async findByOrderId(ordenId: string): Promise<Payment | null> {
    return this.paymentsRepository.findOne({ where: { orden_id: ordenId } });
  }
}
