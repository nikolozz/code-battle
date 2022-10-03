import { DynamicModule, Module, Provider } from '@nestjs/common';
import { CacheService } from './redis.service';

export const CACHE_PROVIDER_OPTIONS = 'CACHE_PROVIDER_OPTIONS';
export const CACHE_PROVIDER = 'CACHE_PROVIDER';

@Module({})
export class CacheModule {
  static forRootAsync(options: any): DynamicModule {
    const cacheServiceProvider: Provider = {
      provide: CACHE_PROVIDER,
      useFactory: (options: { connectionString: string }) =>
        new CacheService(options),
      inject: [CACHE_PROVIDER_OPTIONS],
    };

    return {
      module: CacheModule,
      global: true,
      imports: options.imports,
      providers: [
        {
          provide: CACHE_PROVIDER_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        cacheServiceProvider,
      ],
      exports: [cacheServiceProvider],
    };
  }
}
