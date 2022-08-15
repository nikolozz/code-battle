import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { USER_REPOSITORY_TOKEN } from './constants';

import User from './entities/user.entity';
import { UserRepositoryImpl } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserService,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [UserService, TypeOrmModule],
})
export class UserLibModule {}
