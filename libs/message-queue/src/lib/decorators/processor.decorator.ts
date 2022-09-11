import { SetMetadata } from '@nestjs/common';
import { CONSUMER_TOKEN } from '../constants';
import { MessageHandlerMeta } from '../interfaces';

export const Process = (name: string) => {
  const meta: MessageHandlerMeta = {
    name,
  };

  return SetMetadata(CONSUMER_TOKEN, meta);
};
