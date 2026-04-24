import { Repository } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
export declare class CouponsService {
    private readonly couponsRepository;
    constructor(couponsRepository: Repository<Coupon>);
    findByCode(codigo: string): Promise<Coupon | null>;
    findAll(): Promise<Coupon[]>;
}
