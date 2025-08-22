import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCollaboratorsCommand } from '../../application/command-handlers/import-collaborators.command';
import { TellusApiCollaboratorDto } from '../../application/dtos';
import {
  ListCollaboratorsQuery,
  ListCollaboratorsResult,
} from '../../application/query-handlers/list-collaborators/types';

@Injectable()
export class CollaboratorFacadeService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  importCollaborators(
    collaborators: TellusApiCollaboratorDto[],
  ): Promise<{ success: boolean; error?: string }> {
    const command = CreateCollaboratorsCommand.create({ collaborators });
    return this.commandBus.execute(command);
  }

  listCollaborators(
    take: number,
    skip: number,
  ): Promise<ListCollaboratorsResult> {
    const query = ListCollaboratorsQuery.create({
      skip,
      take,
    });

    return this.queryBus.execute(query);
  }
}
