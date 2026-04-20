import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(data: Partial<User>): Promise<User>;
}
