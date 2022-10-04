import {
  ConfigurableModuleAsyncOptions,
  DynamicModule,
  Module,
  Provider,
} from '@nestjs/common';
import { CACHE_PROVIDER, CACHE_PROVIDER_OPTIONS } from './constants';
import { CacheService } from './redis.service';

@Module({})
export class CacheModule {
  static forRootAsync(
    options: ConfigurableModuleAsyncOptions<CacheModule>
  ): DynamicModule {
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
