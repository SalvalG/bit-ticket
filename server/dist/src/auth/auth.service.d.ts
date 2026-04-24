import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../users/entities/user.entity';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            nombre: string;
            email: string;
            rol: UserRole;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        access_token: string;
        user: {
            id: string;
            nombre: string;
            email: string;
            rol: UserRole;
        };
    }>;
}
