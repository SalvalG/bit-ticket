import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard que protege las rutas requiriendo un token JWT válido.
 * Uso: @UseGuards(JwtAuthGuard) en el controlador o ruta.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
