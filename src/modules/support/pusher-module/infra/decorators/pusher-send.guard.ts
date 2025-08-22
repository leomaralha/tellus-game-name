import { PUSHER_SEND_GUARD } from './constants';

export type ShouldSendMiddleware<Req = any, Res = any> = (
  req: Req,
  res: Res,
  eventName: string,
) => boolean;

export function PusherSendGuard(
  middleware: ShouldSendMiddleware,
): MethodDecorator {
  return (
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Reflect.defineMetadata(PUSHER_SEND_GUARD, middleware, descriptor.value);
    return descriptor;
  };
}
