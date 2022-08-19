import { User } from '@code-battle/api-types';
import { DBUser } from '../entities';

export interface UserRepository {
  getById(id: number): Promise<DBUser>;
  getByEmail(email: string): Promise<User>;
  create(user: DBUser): Promise<User>;
  setJwtRefreshToken(userId: number, token: string): Promise<boolean>;
  removeJwtRefreshToken(userId: number): Promise<boolean>;
}
