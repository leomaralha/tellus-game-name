import { PUSHER_SID_FACTORY } from './constants';

export type PusherSocketIdFactory<Req = any> = (req: Req) => string;

export function PusherSocketId(
  factory: string | PusherSocketIdFactory,
): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Reflect.defineMetadata(PUSHER_SID_FACTORY, factory, descriptor.value);
    return descriptor;
  };
}
