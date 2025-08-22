import { PUSHER_CHANNEL } from './constants';

export type ChannelBuilderMiddleware<Req = any, Res = any> = (
  req: Req,
  res: Res,
  eventName: string,
) => string;

export function PusherChannel(
  channel: string | string[] | ChannelBuilderMiddleware,
): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Reflect.defineMetadata(PUSHER_CHANNEL, channel, descriptor.value);
    return descriptor;
  };
}
