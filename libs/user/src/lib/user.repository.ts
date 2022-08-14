import { InjectRepository } from '@nestjs/typeorm';

import { DBUser } from './entities';
import { User } from './interfaces';
import { UserRepository } from './interfaces/user-repository.interface';
import UserEntity from './entities/user.entity';
import { Repository } from 'typeorm';
import { Roles } from './enums';

export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserEntity) private readonly users: Repository<UserEntity>
  ) {}

  public getById(id: number): Promise<DBUser | null> {
    return this.users.findOneBy({ id });
  }

  public getByEmail(email: string): Promise<User | null> {
    return this.users.findOneBy({ email });
  }

  public create(user: DBUser): Promise<User> {
    const newUser = this.users.create({ ...user, roles: [Roles.User] });

    return this.users.save(newUser);
  }

  public setJwtRefreshToken(userId: number, token: string): Promise<boolean> {
    return this.updateJwtRefreshToken(userId, token);
  }

  public removeJwtRefreshToken(userId: number): Promise<boolean> {
    return this.updateJwtRefreshToken(userId, null);
  }

  private updateJwtRefreshToken(userId: number, token: string | null) {
    return this.users
      .update(userId, {
        hashedRefreshToken: token,
      })
      .then((updateResult) => {
        if (updateResult.affected) {
          return true;
        }
        return false;
      });
  }
}
