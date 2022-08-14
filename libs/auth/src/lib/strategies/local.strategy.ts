import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authenticationService: AuthService) {
    super({ usernameField: 'email' });
  }

  public validate(email: string, password: string) {
    return this.authenticationService.getAuthorizedUser(email, password);
  }
}
