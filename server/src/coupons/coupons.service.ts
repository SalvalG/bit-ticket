import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon)
    private readonly couponsRepository: Repository<Coupon>,
  ) {}

  async findByCode(codigo: string): Promise<Coupon | null> {
    return this.couponsRepository.findOne({ where: { codigo } });
  }

  async findAll(): Promise<Coupon[]> {
    return this.couponsRepository.find();
  }
}
