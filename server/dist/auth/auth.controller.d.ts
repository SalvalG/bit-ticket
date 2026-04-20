import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            nombre: string;
            email: string;
            rol: import("../users/entities/user.entity").UserRole;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        access_token: string;
        user: {
            id: string;
            nombre: string;
            email: string;
            rol: import("../users/entities/user.entity").UserRole;
        };
    }>;
}
