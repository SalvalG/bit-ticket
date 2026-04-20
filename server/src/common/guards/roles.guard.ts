import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/entities/user.entity';

export const ROLES_KEY = 'roles';

/**
 * Guard que verifica si el usuario autenticado tiene el rol requerido.
 * Uso: @Roles(UserRole.ADMIN) junto con @UseGuards(JwtAuthGuard, RolesGuard)
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay roles definidos, la ruta es accesible
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !requiredRoles.includes(user.rol)) {
      throw new ForbiddenException('No tienes permisos para realizar esta acción.');
    }

    return true;
  }
}
