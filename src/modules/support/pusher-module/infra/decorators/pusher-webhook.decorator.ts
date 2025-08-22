import { UseGuards, applyDecorators } from '@nestjs/common';
import { ValidPusherWebhookGuard } from '../guards/valid-pusher-webhook.guard';

export const ValidatePusherWebhook = () =>
  applyDecorators(UseGuards(ValidPusherWebhookGuard));
