import { Entities } from '@/modules/support/typeorm/entities';
import { Migrations } from '@/modules/support/typeorm/migrations';
import { type ConfigService } from '@nestjs/config';
import { type PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions.js';

export default function createTypeormAsyncModuleOptions(
  configService: ConfigService,
) {
  return {
    type: 'postgres' as const,
    host: configService.getOrThrow<string>('DATABASE_HOST'),
    port: parseInt(configService.getOrThrow<string>('DATABASE_PORT'), 10),
    username: configService.getOrThrow<string>('DATABASE_USER'),
    password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
    database: configService.getOrThrow<string>('DATABASE_NAME'),
    synchronize:
      configService.get<string>('DATABASE_SYNCHRONIZE', 'false') === 'true',
    logging: configService.get<string>('DATABASE_LOGGING', 'false') === 'true',
    entities: Entities,
    migrations: Migrations,
  } as PostgresConnectionOptions;
}
