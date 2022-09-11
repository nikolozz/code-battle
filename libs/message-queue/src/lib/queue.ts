import { EventEmitter } from 'events';
import {
  Queue,
  EventMessageOptions,
  EventMessage,
  EventMessageData,
} from './interfaces';

export class QueueImpl extends EventEmitter implements Queue {
  constructor(private readonly name: string) {
    super();
  }

  public getName(): string {
    return this.name;
  }

  public sendEvent<T>(
    name: string,
    data: EventMessageData<T>,
    options?: EventMessageOptions
  ) {
    setTimeout(() => {
      const event: EventMessage<T> = {
        eventName: name,
        data,
        createdAt: new Date(),
      };

      this.emit('*', event);
    }, options.delay || 0);
  }
}
