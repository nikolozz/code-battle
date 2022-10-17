import { Inject, Injectable } from '@nestjs/common';

import { createClient, RedisClientType } from 'redis';
import { CacheClient } from './interfaces/cache-client';
import { CacheOptions } from './interfaces';
import { CACHE_PROVIDER_OPTIONS } from './constants';

@Injectable()
export class CacheService implements CacheClient {
  private redisClient: RedisClientType;

  constructor(
    @Inject(CACHE_PROVIDER_OPTIONS)
    private readonly options: { connectionString: string }
  ) {
    this.redisClient = createClient();
    this.redisClient.connect();
  }

  del(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  async get<T>(key: string): Promise<T> {
    const storedValue = await this.redisClient.get(key.toString());

    let value: any;

    try {
      value = JSON.parse(storedValue);
    } catch (error) {
      value = storedValue;
    }

    return value;
  }

  async set<T>(key: string, value: T, options: CacheOptions): Promise<void> {
    const stringifiedValue =
      typeof value === 'string' ? value : JSON.stringify(value);

    await this.redisClient.set(key, stringifiedValue, { EX: options?.ttl });

    return void 0;
  }
}
