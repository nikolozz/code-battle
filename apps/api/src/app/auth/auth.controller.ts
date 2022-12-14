import { BaseUser } from '@code-battle/common';
import { AuthService, JwtRefreshGuard } from '@code-battle/auth';
import { UserService } from '@code-battle/user';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';

import { CreateUserDto } from './dto/create-user.dto';
import { RequestWithUser } from '../interfaces';

@Controller()
export class AuthController {
  constructor(
    private readonly authenticationService: AuthService,
    private readonly userService: UserService
  ) {}

  @Get('authenticate')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard('jwt'))
  public authenticate(@Req() req: RequestWithUser): BaseUser {
    return req.user;
  }

  @Get('logout')
  @UseGuards(AuthGuard('jwt'))
  public async logout(
    @Req() request: RequestWithUser,
    @Res() response: Response
  ): Promise<Response> {
    await this.userService.removeJwtRefreshToken(request.user.id);
    response.setHeader(
      'Set-Cookie',
      this.authenticationService.getCookieForLogOut()
    );

    return response.sendStatus(200);
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  public async register(
    @Body() createUser: CreateUserDto,
    @Req() request: Request
  ): Promise<BaseUser> {
    const user = await this.authenticationService.register(createUser);

    const accessToken = await this.authenticationService.getCookieWithJwtToken(
      user.id
    );
    const {
      cookie,
      token,
    } = this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    await this.userService.setJwtRefreshToken(user.id, token);

    request.res.setHeader('Set-Cookie', [accessToken, cookie]);

    return user;
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  @UseInterceptors(ClassSerializerInterceptor)
  public async login(@Req() request: RequestWithUser): Promise<BaseUser> {
    const { user } = request;

    const accessToken = await this.authenticationService.getCookieWithJwtToken(
      user.id
    );
    const {
      cookie,
      token,
    } = this.authenticationService.getCookieWithJwtRefreshToken(user.id);

    await this.userService.setJwtRefreshToken(user.id, token);

    request.res.setHeader('Set-Cookie', [accessToken, cookie]);

    return user;
  }

  @Get('refresh-token')
  @UseGuards(JwtRefreshGuard)
  async refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = await this.authenticationService.getCookieWithJwtToken(
      request.user.id
    );
    request.res.setHeader('Set-Cookie', accessTokenCookie);

    return request.user;
  }
}
