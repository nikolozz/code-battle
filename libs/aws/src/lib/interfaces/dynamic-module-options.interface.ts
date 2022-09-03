import { FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { ConfigurationOptions } from 'aws-sdk';

export type DynamicModuleOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<ConfigurationOptions>, 'useFactory' | 'inject'>;
