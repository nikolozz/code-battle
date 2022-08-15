import { AuthLibModule } from '@code-battle/auth';
import { UserLibModule } from '@code-battle/user';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  imports: [AuthLibModule, UserLibModule],
})
export class AuthModule {}
