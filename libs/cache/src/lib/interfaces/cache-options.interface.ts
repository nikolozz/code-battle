export interface CacheDecoratorOptions {
  key: string;
  ttl?: number;
}

export type CacheOptions = Omit<CacheDecoratorOptions, 'key'>;
