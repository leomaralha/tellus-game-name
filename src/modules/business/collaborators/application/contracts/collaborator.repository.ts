import { type Collaborator } from '../../domain/aggregates/collaborators';

export type IListCriteria = {
  exceptIds?: string[];
};

export abstract class ICollaboratorRepository {
  abstract save(collaborators: Collaborator[]): Promise<void>;
  abstract list(criteria: IListCriteria): Promise<Collaborator[]>;
}
