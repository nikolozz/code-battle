import { Inject } from '@nestjs/common';

export const InjectQueue = (name: string) => Inject(name);
