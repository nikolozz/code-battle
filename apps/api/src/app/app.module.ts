import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageQueueModule } from '@code-battle/message-queue';
import { ChallengeModule } from './challenge/challenge.module';

import * as Joi from '@hapi/joi';
import { UserEntity } from '@code-battle/user';
import { AuthModule } from './auth/auth.module';
import { ChallengeEntity, ChallengeRoomEntity } from '@code-battle/challenge';
import { CacheModule } from '@code-battle/cache';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
        REDIS_CONNECTION_URL: Joi.string(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB'),
          synchronize: true,
          logging:
            configService.get('NODE_ENV') === 'development' ? true : false,
          entities: [UserEntity, ChallengeRoomEntity, ChallengeEntity],
        };
      },
    }),
    MessageQueueModule.register(['CHALLENGE_QUEUE']),
    CacheModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connectionString: configService.get('REDIS_CONNECTION_URL'),
      }),
    }),
    AuthModule,
    ChallengeModule,
  ],
})
export class AppModule {}
