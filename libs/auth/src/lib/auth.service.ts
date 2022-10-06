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

import { DBUser, UserService } from '@code-battle/user';

import { JwtTokenPayload } from './interfaces';
import { User, UserSignUp } from '@code-battle/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {}

  public async register(user: UserSignUp): Promise<User | null> {
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
        const constraint = error?.table === 'users' ? 'username' : 'email';

        throw new HttpException(
          `User with that ${constraint} already exists`,
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

    if (!user) {
      throw new UnauthorizedException(`Unauthorized error`);
    }

    await this.validatePassword(password, user.password);

    return user;
  }

  public async getAuthorizedUserFromToken(token: string): Promise<DBUser | null> {
    const { userId } = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });

    return this.userService.getById(userId);
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
  ): {
    cookie: string;
    token: string;
  } {
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
