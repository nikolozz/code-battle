export const mockedJwtService = {
  signAsync: () => Promise.resolve('fakeToken'),
  sign: () => 'fakeToken',
};
