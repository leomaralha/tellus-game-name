import { type Collaborator } from '../../domain/aggregates/collaborators';

export type IListCriteria = {
  exceptIds?: string[];
};

export type CreateCollaboratorDTO = Omit<Collaborator, 'id'>;

export abstract class ICollaboratorRepository {
  abstract save(collaborators: CreateCollaboratorDTO[]): Promise<void>;
  abstract list(criteria: IListCriteria): Promise<Collaborator[]>;
}
