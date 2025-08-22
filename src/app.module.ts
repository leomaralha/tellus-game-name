import { Module } from '@nestjs/common';
import { CollaboratorModule } from './modules/business/collaborators/collaborator.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import createTypeormAsyncModuleOptions from './common/app-modules-factory/typeorm.factory';
import { CqrsModule } from '@nestjs/cqrs';
import { BullModule } from '@nestjs/bullmq';
import bullMqModuleOptionsFactory from './common/app-modules-factory/bullmq-module-options.factory';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: bullMqModuleOptionsFactory,
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: createTypeormAsyncModuleOptions,
      inject: [ConfigService],
    }),
    CqrsModule.forRoot(),
    CollaboratorModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
