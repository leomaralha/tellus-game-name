import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  PUSHER_CHANNEL,
  PUSHER_EVENT,
  PUSHER_SEND_GUARD,
  PUSHER_SID_FACTORY,
} from '../decorators/constants';
import { ShouldSendMiddleware } from '../decorators/pusher-send.guard';
import { ChannelBuilderMiddleware } from '../decorators/pusher-channel.decorator';
import { PusherSocketIdFactory } from '../decorators/pusher-socket-id.decorator';
import { PusherService } from '../facade-services/pusher.service';
import { Request } from 'express';

type ChannelMetadata = string | string[] | ChannelBuilderMiddleware;
type SocketIdFactory = string | PusherSocketIdFactory;

/**
 * Intercepts the HTTP response and dispatches the pusher-event with the custom decorators
 * Binding this decorator globally will run just fine, PusherInterceptor checks whether the HTTP method supports or not
 * pusher events and skip normally if its not supported
 */
@Injectable()
export class PusherInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PusherInterceptor.name);
  constructor(
    private readonly reflector: Reflector,
    private readonly pusherService: PusherService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const eventName = this.reflector.get<string>(
      PUSHER_EVENT,
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      tap((data: any) => {
        if (!eventName) {
          return;
        }

        const sendGuard = this.reflector.get<ShouldSendMiddleware>(
          PUSHER_SEND_GUARD,
          context.getHandler(),
        );

        const channelMetadata = this.reflector.get<ChannelMetadata>(
          PUSHER_CHANNEL,
          context.getHandler(),
        );
        const socketIdFactory = this.reflector.get<SocketIdFactory>(
          PUSHER_SID_FACTORY,
          context.getHandler(),
        );

        if (sendGuard && !sendGuard(request, data, eventName)) {
          return;
        }

        if (!channelMetadata) {
          this.logger.warn(
            `PusherChannel not found for handler: ${
              context.getHandler().name
            } at event: ${eventName}`,
          );
          return;
        }

        let channelName: string | string[];
        if (typeof channelMetadata === 'function') {
          channelName = channelMetadata(request, data, eventName);
        } else {
          channelName = channelMetadata;
        }

        const socketId: string | undefined = socketIdFactory
          ? typeof socketIdFactory === 'string'
            ? (request.headers[socketIdFactory] as string)
            : socketIdFactory(request)
          : (request.headers['x-pusher-sid'] as string);

        void this.pusherService.trigger(channelName, eventName, data, socketId);
      }),
    );
  }
}
