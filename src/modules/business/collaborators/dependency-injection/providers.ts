import { ImportCollaboratorsCommandHandler } from '../application/command-handlers/import-collaborators.command';
import { ListCollaboratorsQueryHandler } from '../application/query-handlers/list-collaborators';
import { CollaboratorFacadeService } from '../application/services/collaborator.facade.service';
import { ICollaboratorRepository } from '../application/contracts/collaborator.repository';
import { TypeOrmCollaboratorRepository } from '../infra/adapters/persistence/typeorm/repositories/typeorm-collaborator.repository';

export const CommandHandlers = [ImportCollaboratorsCommandHandler];
export const QueryHandlers = [ListCollaboratorsQueryHandler];

export const SharedProviders = [
  CollaboratorFacadeService,
  {
    provide: ICollaboratorRepository,
    useClass: TypeOrmCollaboratorRepository,
  },
];
