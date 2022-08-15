import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon from 'argon2';

import { UserService } from '@code-battle/user';
import {
  mockedConfigService,
  mockedJwtService,
  mockUser,
} from '@code-battle/mocks';
import { UserSignUp } from '@code-battle/api-types';

import { AuthService } from './auth.service';

describe('The AuthenticationService', () => {
  let authenticationService: AuthService;

  const createUserMock: UserSignUp = {
    email: 'test@test.com',
    username: 'test-user',
    password: 'password123',
    repeatPassword: 'password123',
  };

  const userRepository = { create: () => Promise.resolve(mockUser) };

  beforeEach(async () => {
    const authModule = await Test.createTestingModule({
      imports: [],
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            getByEmail: () => Promise.resolve(mockUser),
            createUser: () => Promise.resolve(mockUser),
          },
        },
        { provide: JwtService, useValue: mockedJwtService },
        { provide: ConfigService, useValue: mockedConfigService },
      ],
    }).compile();

    authenticationService = authModule.get(AuthService);
  });

  describe('register', () => {
    beforeEach(() => {
      jest
        .spyOn(argon, 'hash')
        .mockImplementation(() => Promise.resolve('string'));
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should throw error if passwords does not math', async () => {
      try {
        await authenticationService.register({
          ...createUserMock,
          repeatPassword: 'fake',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });

    it('should create a new user', async () => {
      const newUser = await authenticationService.register(createUserMock);

      expect(newUser).toBe(mockUser);
    });

    it('should not create a new user if email/username exists', async () => {
      jest.spyOn(userRepository, 'create').mockImplementation(() => {
        throw new Error();
      });

      try {
        await authenticationService.register(createUserMock);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('getAuthorizedUser', () => {
    it('should return user if password matches', async () => {
      jest
        .spyOn(argon, 'verify')
        .mockImplementation(() => Promise.resolve(true));

      const user = await authenticationService.getAuthorizedUser(
        mockUser.email,
        mockUser.password
      );

      expect(user).toBe(mockUser);
    });

    it('should not return user if password does not matches', async () => {
      jest
        .spyOn(argon, 'verify')
        .mockImplementation(() => Promise.resolve(false));

      try {
        await authenticationService.getAuthorizedUser(
          mockUser.email,
          mockUser.password
        );
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });

  describe('jwt', () => {
    it('should sign jwt token', async () => {
      const token = await authenticationService.signJwtToken({
        userId: mockUser.id,
      });
      expect(token).toBe('fakeToken');
    });

    it('should sign jwt refresh token', async () => {
      const token = await authenticationService.signJwtRefreshToken({
        userId: mockUser.id,
      });

      expect(token).toBe('fakeToken');
    });
  });

  describe('when creating a cookie', () => {
    it('should return a authentication cookie', async () => {
      const userId = 1;

      const cookies = await authenticationService.getCookieWithJwtToken(userId);

      const token = 'fakeToken';
      const expirationTime = '3600';

      expect(cookies).toEqual(
        `Authentication=${token}; HttpOnly; Path=/; Max-Age=${expirationTime}`
      );
    });

    it('should return a refresh token cookie', async () => {
      const userId = 1;

      const cookies = await authenticationService.getCookieWithJwtRefreshToken(
        userId
      );

      const token = 'fakeToken';
      const expirationTime = '36000';

      expect(cookies.cookie).toEqual(
        `Refresh=${token}; HttpOnly; Path=/; Max-Age=${expirationTime}`
      );
    });

    it('should return cookies for logout', () => {
      const cookies = authenticationService.getCookieForLogOut();

      expect(cookies).toEqual([
        'Authentication=; HttpOnly; Path=/; Max-Age=0',
        'Refresh=; HttpOnly; Path=/; Max-Age=0',
      ]);
    });
  });
});
