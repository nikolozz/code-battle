export const mockConfigService = {
  get(key: string) {
    switch (key) {
      case 'JWT_EXPIRATION_TIME':
        return '3600';
      case 'JWT_REFRESH_TOKEN_EXPIRATION_TIME':
        return '36000';
      case 'CHALLENGE_ROOM_DELAY_BEFORE_DELETE':
        return 5000;
      default:
        return '';
    }
  },
};
