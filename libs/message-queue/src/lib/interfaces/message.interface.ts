export type EventMessageData<T> = { id: string; body: T };

export interface EventMessage<T> {
  eventName: string;
  data: EventMessageData<T>;
  createdAt: Date;
}

export interface EventMessageOptions {
  delay: number;
}
