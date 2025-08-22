import {
  DynamicModule,
  FactoryProvider,
  Module,
  ModuleMetadata,
  Provider,
} from '@nestjs/common';
import Pusher from 'pusher';
import { PusherService } from './infra/facade-services/pusher.service';
import {
  MODULE_OPTIONS,
  PUSHER_TOKEN_SECRET,
} from './infra/decorators/constants';
import { AuthenticationController } from './infra/ports/http/authentication.controller';

export interface NestJsPusherOptions {
  options: Pusher.Options;
}

export type NestJsPusherAsyncOptions = Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider<NestJsPusherOptions>, 'useFactory' | 'inject'>;

@Module({})
export class PusherModule {
  static forRoot(options: Pusher.Options, isGlobal = true): DynamicModule {
    const providers: Provider[] = [
      {
        provide: PusherService,
        useValue: new PusherService(options),
      },
      {
        provide: PUSHER_TOKEN_SECRET,
        useValue: options.secret,
      },
      {
        provide: MODULE_OPTIONS,
        useValue: { options },
      },
    ];
    return {
      module: PusherModule,
      global: isGlobal,
      controllers: [AuthenticationController],
      providers,
      exports: providers,
    };
  }

  static forRootAsync(
    options: NestJsPusherAsyncOptions,
    isGlobal = true,
  ): DynamicModule {
    const providers: Provider[] = [
      {
        provide: MODULE_OPTIONS,
        useFactory: async (...args) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          const nestJsPusherOptions = await options.useFactory(...args);
          return nestJsPusherOptions;
        },
        inject: options.inject,
      },
      {
        provide: PusherService,
        useFactory: (nestJsPusherOptions: NestJsPusherOptions) => {
          return new PusherService(nestJsPusherOptions.options);
        },
        inject: [MODULE_OPTIONS],
      },
      {
        provide: PUSHER_TOKEN_SECRET,
        useFactory: (nestJsPusherOptions: NestJsPusherOptions) => {
          return nestJsPusherOptions.options.secret;
        },
        inject: [MODULE_OPTIONS],
      },
    ];
    return {
      module: PusherModule,
      imports: options.imports,
      global: isGlobal,
      controllers: [AuthenticationController],
      providers,
      exports: providers,
    };
  }
}
