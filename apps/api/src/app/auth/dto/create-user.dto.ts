import { UserSignUp } from '@code-battle/api-types';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto implements UserSignUp {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  password: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(32)
  repeatPassword: string;
}
