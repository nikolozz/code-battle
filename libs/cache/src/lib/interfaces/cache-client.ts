import { CacheOptions } from './cache-options.interface';

export interface CacheClient {
  get<T>(key: string): Promise<T>;
  set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;
  del(key: string): Promise<number>;
}
