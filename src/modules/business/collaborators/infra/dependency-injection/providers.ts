import { ImportCollaboratorsCommandHandler } from '../../application/command-handlers/import-collaborators.command';
import { ListCollaboratorsQueryHandler } from '../../application/query-handlers/list-collaborators';
import { ICollaboratorRepository } from '../../application/contracts/collaborator.repository';
import { TypeOrmCollaboratorRepository } from '../adapters/persistence/typeorm/repositories/typeorm-collaborator.repository';
import { CollaboratorFacadeService } from '../services/collaborator.facade.service';

export const CommandHandlers = [ImportCollaboratorsCommandHandler];
export const QueryHandlers = [ListCollaboratorsQueryHandler];

export const SharedProviders = [
  CollaboratorFacadeService,
  {
    provide: ICollaboratorRepository,
    useClass: TypeOrmCollaboratorRepository,
  },
];
