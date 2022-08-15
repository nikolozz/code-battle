import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

import { DBUser, RegisterUser, UserService } from '@code-battle/user';

import { JwtTokenPayload } from './interfaces';
import { User } from '@code-battle/api-types';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  public async register(user: RegisterUser): Promise<User | null> {
    this.validateConfirmPassword(user.password, user.repeatPassword);

    const hashedPassword = await argon.hash(user.password);

    try {
      const newUser = await this.userService.createUser({
        ...user,
        password: hashedPassword,
      });

      return newUser;
    } catch (error) {
      // TODO Move to Enum
      if (error?.code === '23505') {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  public async getAuthorizedUser(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this.userService.getByEmail(email);

    this.validatePassword(password, user.password);

    return user;
  }

  public signJwtToken(payload: JwtTokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  public signJwtRefreshToken(payload: JwtTokenPayload): Promise<string> {
    const expiresIn =
      this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME') + 's';

    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn,
    });
  }

  public async getCookieWithJwtToken(userId: number): Promise<string> {
    const payload: JwtTokenPayload = {
      userId,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: `${this.configService.get('JWT_EXPIRATION_TIME')}s`,
    });

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME'
    )}`;
  }

  public getCookieWithJwtRefreshToken(
    userId: number
  ): { cookie: string; token: string } {
    const payload: JwtTokenPayload = { userId };

    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME'
      )}s`,
    });

    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME'
    )}`;

    return {
      cookie,
      token,
    };
  }

  public getUserFromCookie(authenticationToken: string): Promise<DBUser> {
    const payload: JwtTokenPayload = this.jwtService.verify(
      authenticationToken,
      {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      }
    );
    if (payload?.userId) {
      return this.userService.getById(payload?.userId);
    }
  }

  public getCookieForLogOut(): string[] {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  private validateConfirmPassword(
    password: string,
    confirmPassword: string
  ): void {
    if (password !== confirmPassword) {
      throw new BadRequestException({
        message: 'Passwords does not match',
      });
    }
  }

  private validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return argon.verify(hashedPassword, password).then((result) => {
      if (result) {
        return true;
      }

      throw new UnauthorizedException();
    });
  }
}
