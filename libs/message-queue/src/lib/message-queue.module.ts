import { DiscoveryModule, DiscoveryService } from '@nestjs-plus/discovery';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { QueueService } from './queue.service';

import { ConsumerQueue } from './interfaces';
import { QueueImpl } from './queue';

@Global()
@Module({
  imports: [DiscoveryModule],
  providers: [QueueService],
})
export class MessageQueueModule {
  static register(queues: string[]): DynamicModule {
    const queueProviders = this.registerQueues(queues);

    const queueProvider: Provider = {
      provide: QueueService,
      useFactory: (discovery: DiscoveryService, ...queues: ConsumerQueue[]) => {
        return new QueueService(discovery, ...queues);
      },
      inject: [DiscoveryService, ...queues],
    };

    return {
      global: true,
      module: MessageQueueModule,
      imports: [DiscoveryModule],
      providers: [queueProvider, ...queueProviders],
      exports: [queueProvider, ...queueProviders],
    };
  }

  private static registerQueues(queueNames: string[]): Provider[] {
    return queueNames.map((name) => ({
      provide: name,
      useFactory: () => new QueueImpl(name),
    }));
  }
}
