import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { type NestExpressApplication } from '@nestjs/platform-express';
import {
  DocumentBuilder,
  type OpenAPIObject,
  SwaggerModule,
} from '@nestjs/swagger';
import { AppModule } from './app.module.js';

type ServerOptions = { port: number };

export class ServerApplication {
  private app?: NestExpressApplication;
  private readonly port: number;

  constructor(options: ServerOptions) {
    this.port = options.port;
  }

  public async start(): Promise<void> {
    const app: NestExpressApplication =
      await NestFactory.create<NestExpressApplication>(AppModule, {
        rawBody: true,
      });

    this.buildAPIDocumentation(app);
    this.configureService(app);
    await this.init(app);
  }

  public getApp(): NestExpressApplication {
    if (!this.app) {
      throw new Error('Server not started');
    }

    return this.app;
  }

  private configureService(app: NestExpressApplication) {
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        transformOptions: {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        },
        errorHttpStatusCode: HttpStatus.PRECONDITION_FAILED,
      }),
    );

    app.enableCors();
    app.useBodyParser('json', { limit: '5mb' });
    app.disable('x-powered-by');
  }

  private async init(app: NestExpressApplication) {
    await app.listen(this.port);
    this.app = app;
  }

  private buildAPIDocumentation(app: NestExpressApplication): void {
    const title = 'Tellus';
    const version = '0.0.1';
    const description = 'The Game Name documentation';

    const options: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addBearerAuth()
      .build();

    const document: OpenAPIObject = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('documentation', app, document);
  }
}
