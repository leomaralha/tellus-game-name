import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { Request } from 'express';
import { PUSHER_TOKEN_SECRET } from '../decorators/constants';

@Injectable()
export class ValidPusherWebhookGuard implements CanActivate {
  private readonly logger = new Logger(ValidPusherWebhookGuard.name);

  constructor(
    @Inject(PUSHER_TOKEN_SECRET)
    private readonly tokenSecret: string,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { rawBody?: Buffer }>();

    const receivedSignature = request.headers['x-pusher-signature'] as string;

    if (!receivedSignature) {
      this.logger.warn('Missing X-Pusher-Signature header');
      throw new UnauthorizedException('Missing webhook signature');
    }

    const rawBody = request.rawBody;

    if (!rawBody) {
      this.logger.warn('Missing request body for signature validation');
      throw new UnauthorizedException('Missing request body');
    }

    const expectedSignature = crypto
      .createHmac('sha256', this.tokenSecret)
      .update(rawBody)
      .digest('hex');

    const isValid = crypto.timingSafeEqual(
      Buffer.from(receivedSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex'),
    );

    if (!isValid) {
      this.logger.warn('Invalid webhook signature');
      throw new UnauthorizedException('Invalid webhook signature');
    }

    this.logger.debug('Webhook signature validated successfully');
    return true;
  }
}
