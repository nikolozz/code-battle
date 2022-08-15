import { mockUser, mockUserRepository } from '@code-battle/mocks';
import { Test } from '@nestjs/testing';
import * as argon from 'argon2';

import { USER_REPOSITORY_TOKEN } from './constants';
import { Roles } from './enums';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;

  let getById: jest.SpyInstance;
  let getByEmail: jest.SpyInstance;

  const email = 'test@test.com';
  const refreshToken = 'fakeRefreshToken';

  beforeEach(async () => {
    const userModule = await Test.createTestingModule({
      imports: [],
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: mockUserRepository,
        },
      ],
      exports: [UserService],
    }).compile();

    getById = jest.spyOn(mockUserRepository, 'getById');
    getByEmail = jest.spyOn(mockUserRepository, 'getByEmail');

    userService = userModule.get(UserService);
  });

  afterAll(() => {
    jest.clearAllMocks();
    getById.mockClear();
    getByEmail.mockClear();
  });

  describe('getById', () => {
    it('should return the user by email if the user exists in DB', async () => {
      const user = await userService.getByEmail(email);

      expect(user).toEqual(mockUser);
    });

    it('should return null if user cannot be found by email', async () => {
      getByEmail.mockImplementation(() => Promise.resolve(null));

      const user = await userService.getByEmail(email);

      expect(user).toBe(null);
    });
  });

  describe('getByRefreshToken', () => {
    it('should return user if refreshToken is valid', async () => {
      jest
        .spyOn(argon, 'verify')
        .mockImplementation(() => Promise.resolve(true));

      const user = await userService.getByRefreshToken(
        mockUser.id,
        refreshToken
      );

      expect(user).toEqual(mockUser);
    });

    it('should return null if refreshToken is invalid', async () => {
      jest
        .spyOn(argon, 'verify')
        .mockImplementation(() => Promise.resolve(false));

      const user = await userService.getByRefreshToken(
        mockUser.id,
        refreshToken
      );

      expect(user).toBe(null);
    });
  });

  describe('create', () => {
    it('should create user', async () => {
      const userToCreate = {
        email: mockUser.email,
        username: mockUser.username,
        password: mockUser.password,
      };

      const createSpy = jest
        .spyOn(mockUserRepository, 'create')
        .mockImplementation(() => Promise.resolve(mockUser));

      const user = await userService.createUser(userToCreate);

      expect(user).toEqual(mockUser);
      expect(createSpy).toBeCalledWith({
        ...userToCreate,
        roles: [Roles.User],
      });
    });
  });

  describe('setJwtRefreshToken', () => {
    it('should set refresh token for the user', async () => {
      jest
        .spyOn(argon, 'hash')
        .mockImplementation(() => Promise.resolve(refreshToken));

      const setJwtRefreshTokenSpy = jest
        .spyOn(mockUserRepository, 'setJwtRefreshToken')
        .mockImplementation(() => Promise.resolve(true));

      const isTokenSet = await userService.setJwtRefreshToken(
        mockUser.id,
        refreshToken
      );

      expect(isTokenSet).toBe(true);
      expect(setJwtRefreshTokenSpy).toBeCalledWith(mockUser.id, refreshToken);
    });
  });

  describe('removeJwtRefreshToken', () => {
    it('should remove refresh token for the user', async () => {
      const removeJwtRefreshTokenSpy = jest
        .spyOn(mockUserRepository, 'removeJwtRefreshToken')
        .mockImplementation(() => Promise.resolve(true));

      const isTokenRemoved = await userService.removeJwtRefreshToken(
        mockUser.id
      );

      expect(isTokenRemoved).toBe(true);
      expect(removeJwtRefreshTokenSpy).toBeCalledWith(mockUser.id);
    });
  });
});
