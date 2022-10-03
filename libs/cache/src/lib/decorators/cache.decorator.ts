import { Inject } from '@nestjs/common';
import { CACHE_PROVIDER } from '../cache.module';
import { CacheClient, CacheDecoratorOptions } from '../interfaces';

export function Cached({ key, ttl }: CacheDecoratorOptions) {
  const injectYourService = Inject(CACHE_PROVIDER);

  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    injectYourService(target, 'cacheService');

    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      const cacheService: CacheClient = this.cacheService;

      const hit = await cacheService.get(key);

      if (hit) {
        return JSON.parse(hit);
      }

      const result = await originalMethod.apply(this, args);
      await cacheService.set(key, JSON.stringify(result), { ttl });

      return result;
    };
  };
}
