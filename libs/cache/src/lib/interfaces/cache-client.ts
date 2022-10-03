import { CacheDecoratorOptions } from './cache-options.interface';

export interface CacheClient {
  get(key: string): Promise<string>;
  del(key: string): Promise<number>;
  set(
    key: string,
    value: any,
    options?: Omit<CacheDecoratorOptions, 'key'>
  ): Promise<string>;
}
