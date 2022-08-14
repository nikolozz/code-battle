import { User } from '@code-battle/user';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: User;
}
