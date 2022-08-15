import { Roles } from '@code-battle/user';
import { SetMetadata } from '@nestjs/common';

export const RequiredRoles = (...roles: Roles[]) => SetMetadata('roles', roles);
