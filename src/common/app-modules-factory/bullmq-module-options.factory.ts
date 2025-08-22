import { type ConfigService } from '@nestjs/config';
import type { QueueOptions } from 'bullmq';

export default function bullMqModuleOptionsFactory(
  configService: ConfigService,
): QueueOptions {
  return {
    connection: {
      host: configService.getOrThrow<string>('REDIS_HOST', 'localhost'),
      port: configService.getOrThrow<number>('REDIS_PORT', 6379),
      username: configService.get<string | undefined>('REDIS_USERNAME'),
      password: configService.get<string | undefined>('REDIS_PASSWORD'),
    },
    defaultJobOptions: {
      removeOnComplete: 10,
      removeOnFail: 5,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    },
  };
}
