import { User } from '@code-battle/common';
import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: User;
}
