import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
export declare class PaymentsService {
    private readonly paymentsRepository;
    constructor(paymentsRepository: Repository<Payment>);
    findByOrderId(ordenId: string): Promise<Payment | null>;
}
