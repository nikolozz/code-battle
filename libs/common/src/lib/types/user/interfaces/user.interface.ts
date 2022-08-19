import { BaseUser } from './base-user.interface';

export interface User extends BaseUser {
  readonly password: string;
}
