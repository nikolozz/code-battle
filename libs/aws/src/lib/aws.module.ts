import { DynamicModule, Module } from '@nestjs/common';
import { config, ConfigurationOptions } from 'aws-sdk';
import { AWS_CONNECTION, AWS_CONNECTION_OPTIONS } from './constants';
import { DynamicModuleOptions } from './interfaces';

@Module({})
export class AwsModule {
  static registerAsync(options: DynamicModuleOptions): DynamicModule {
    return {
      module: AwsModule,
      imports: options.imports,
      providers: [
        {
          provide: AWS_CONNECTION_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        {
          provide: AWS_CONNECTION,
          useFactory: (options: ConfigurationOptions) => {
            config.update({
              region: options.region,
              accessKeyId: options.accessKeyId,
              secretAccessKey: options.secretAccessKey,
            });
          },
          inject: [AWS_CONNECTION_OPTIONS],
        },
      ],
    };
  }
}
