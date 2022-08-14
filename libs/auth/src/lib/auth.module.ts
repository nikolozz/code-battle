import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import { UserLibModule } from '@code-battle/user';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import {
  JwtRefreshTokenStrategy,
  JwtStrategy,
  LocalStrategy,
} from './strategies';

export const AUTH_CONFIG_TOKEN = 'AUTH_CONFIG';

const authConfig = registerAs(AUTH_CONFIG_TOKEN, () => ({
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME:
    process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
}));

@Module({
  imports: [
    UserLibModule,
    ConfigModule.forFeature(authConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
        },
      }),
    }),
    PassportModule,
  ],
  providers: [AuthService, JwtStrategy, JwtRefreshTokenStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthLibModule {}
