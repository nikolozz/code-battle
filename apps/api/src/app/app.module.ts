import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AwsModule } from '@code-battle/aws';
import { MessageQueueModule } from '@code-battle/message-queue';
import { ChallengeModule } from './challenge/challenge.module';

import * as Joi from '@hapi/joi';
import { UserEntity } from '@code-battle/user';
import { AuthModule } from './auth/auth.module';
import { ChallengeEntity, ChallengeRoomEntity } from '@code-battle/challenge';

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
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY_ID: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        PORT: Joi.number(),
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
    AwsModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        region: configService.get('AWS_REGION'),
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY_ID'),
      }),
    }),
    MessageQueueModule.register(['CHALLENGE_QUEUE']),
    AuthModule,
    ChallengeModule,
  ],
})
export class AppModule {}
