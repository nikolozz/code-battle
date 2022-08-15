import { mockUser } from './user.mock';

export const mockUserRepository = {
  getById: () => Promise.resolve(mockUser),
  getByEmail: () => Promise.resolve(mockUser),
  create: () => Promise.resolve(mockUser),
  setJwtRefreshToken: () => Promise.resolve(true),
  removeJwtRefreshToken: () => Promise.resolve(true),
};
