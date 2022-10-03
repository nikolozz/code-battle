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

  get(key: string): Promise<string> {
    return this.redisClient.get(key);
  }

  set(key: string, value: string, options: CacheOptions): Promise<string> {
    return this.redisClient.set(key, value, { EX: options?.ttl });
  }
}
