import { EventMessageData, EventMessageOptions } from './message.interface';

export interface ProducerQueue {
  sendEvent<T>(name: string, data: T, options: { delay: number }): void;
}

export interface ConsumerQueue {
  on<T>(name: string, data: T): void;
  getName(): string;
}

export interface Queue {
  getName(): string;
  sendEvent<T>(
    name: string,
    data: EventMessageData<T>,
    options?: EventMessageOptions
  );
}
