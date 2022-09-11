import { DiscoveryService } from '@nestjs-plus/discovery';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { CONSUMER_TOKEN } from './constants';
import { ConsumerQueue, MessageHandlerMeta } from './interfaces';

@Injectable()
export class QueueService implements OnModuleInit {
  private queues: ConsumerQueue[];

  constructor(
    private readonly discover: DiscoveryService,
    ...queues: ConsumerQueue[]
  ) {
    this.queues = queues;
  }

  async onModuleInit() {
    const queueHandlers = await this.discover.providerMethodsWithMetaAtKey<
      MessageHandlerMeta
    >(CONSUMER_TOKEN);

    for (const queue of this.queues) {
      const handler = queueHandlers.find(
        ({ meta }) => meta.name === queue.getName()
      );

      queue.on('*', (data: unknown) => {
        handler.discoveredMethod.handler.call(
          handler.discoveredMethod.parentClass.instance,
          data
        );
      });
    }
  }
}
