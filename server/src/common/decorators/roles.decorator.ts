import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../users/entities/user.entity';
import { ROLES_KEY } from '../guards/roles.guard';

/**
 * Decorador para restringir rutas a roles específicos.
 * Ejemplo: @Roles(UserRole.ADMIN)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
