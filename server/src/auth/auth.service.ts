import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * UC1: Registro de Usuario
   * Valida que el correo no exista, hashea la contraseña y crea la cuenta.
   */
  async register(registerDto: RegisterDto) {
    const { nombre, email, password } = registerDto;

    // Verificar que el correo no esté registrado
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException(
        'El correo electrónico ya está registrado. Intenta iniciar sesión.',
      );
    }

    // Encriptar contraseña con bcrypt (salt rounds = 10)
    const password_hash = await bcrypt.hash(password, 10);

    // Crear usuario con rol CLIENTE por defecto
    const user = await this.usersService.create({
      nombre,
      email,
      password_hash,
      rol: UserRole.CLIENTE,
    });

    // Retornar datos sin el hash de la contraseña
    return {
      message: 'Cuenta creada exitosamente.',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    };
  }

  /**
   * UC2: Inicio de Sesión
   * Verifica credenciales y genera un token JWT.
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Buscar usuario por correo
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Correo o contraseña inválidos.');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Correo o contraseña inválidos.');
    }

    // Generar token JWT
    const payload = {
      sub: user.id,
      email: user.email,
      rol: user.rol,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      message: 'Inicio de sesión exitoso.',
      access_token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    };
  }
}
