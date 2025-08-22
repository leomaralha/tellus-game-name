import { CollaboratorEntity } from '@/modules/support/typeorm/entities/collaborator.entity';
import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListCollaboratorsQuery, ListCollaboratorsResult } from './types';

@QueryHandler(ListCollaboratorsQuery)
export class ListCollaboratorsQueryHandler
  implements IQueryHandler<ListCollaboratorsQuery, ListCollaboratorsResult>
{
  constructor(
    @InjectRepository(CollaboratorEntity)
    private readonly collaboratorRepository: Repository<CollaboratorEntity>,
  ) {}

  async execute(
    query: ListCollaboratorsQuery,
  ): Promise<ListCollaboratorsResult> {
    const collaborators = await this.collaboratorRepository.find({
      take: query.take,
      skip: query.skip,
    });
    return { collaborators };
  }
}
