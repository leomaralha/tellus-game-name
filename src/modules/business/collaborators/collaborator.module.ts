import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { CollaboratorModuleEntities } from './infra/dependency-injection/database-entities';
import {
  CommandHandlers,
  QueryHandlers,
  SharedProviders,
} from './infra/dependency-injection/providers';
import { CollaboratorController } from './infra/ports/http/collaborators.controller';

@Module({
  imports: [TypeOrmModule.forFeature(CollaboratorModuleEntities), CqrsModule],
  providers: [...CommandHandlers, ...QueryHandlers, ...SharedProviders],
  exports: [...SharedProviders],
  controllers: [CollaboratorController],
})
export class CollaboratorModule {}
