export const mockedConfigService = {
  get(key: string) {
    switch (key) {
      case 'JWT_EXPIRATION_TIME':
        return '3600';
      case 'JWT_REFRESH_TOKEN_EXPIRATION_TIME':
        return '36000';
      case 'INACTIVE_CHALLENGE_ROOM_IN_SECONDS':
        return '5000';
      default:
        return '';
    }
  },
};
