import { Inject, Injectable } from '@nestjs/common';
import * as argon from 'argon2';

import { USER_REPOSITORY_TOKEN } from './constants';
import { DBUser } from './entities';
import { Roles } from './enums';
import { User } from './interfaces';
import { UserRepository } from './interfaces/user-repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepository
  ) {}

  public getById(userId: number): Promise<DBUser | null> {
    return this.userRepository.getById(userId);
  }

  public async getByRefreshToken(
    userId: number,
    refreshToken: string
  ): Promise<DBUser | null> {
    const user = await this.getById(userId);

    console.log(user.hashedRefreshToken, refreshToken);

    const isRefreshTokenMatch = await argon.verify(
      user.hashedRefreshToken,
      refreshToken
    );

    if (!isRefreshTokenMatch) {
      return null;
    }

    return user;
  }

  public getByEmail(email: string): Promise<User | null> {
    return this.userRepository.getByEmail(email);
  }

  public async createUser(user: Omit<User, 'id'>) {
    return this.userRepository.create({
      ...user,
      roles: [Roles.User],
    });
  }

  public async setJwtRefreshToken(
    userId: number,
    token: string
  ): Promise<boolean> {
    const hashedRefreshToken = await argon.hash(token);

    return this.userRepository.setJwtRefreshToken(userId, hashedRefreshToken);
  }

  public removeJwtRefreshToken(userId: number): Promise<boolean> {
    return this.userRepository.removeJwtRefreshToken(userId);
  }
}
