import { PUSHER_EVENT } from './constants';

export function PusherEvent(name: string): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Reflect.defineMetadata(PUSHER_EVENT, name, descriptor.value);
    return descriptor;
  };
}
