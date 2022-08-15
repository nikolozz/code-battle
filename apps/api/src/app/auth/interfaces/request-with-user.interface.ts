import { User } from '@code-battle/api-types';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: User;
}
