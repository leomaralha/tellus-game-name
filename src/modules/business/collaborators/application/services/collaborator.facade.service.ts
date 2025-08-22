import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCollaboratorsCommand } from '../command-handlers/import-collaborators.command';
import {
  ListCollaboratorsQuery,
  ListCollaboratorsResult,
} from '../query-handlers/list-collaborators/types';
import { TellusApiCollaboratorDto } from '../dtos';

@Injectable()
export class CollaboratorFacadeService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async importCollaborators(
    collaborators: TellusApiCollaboratorDto[],
  ): Promise<{ success: boolean; error?: string }> {
    const command = CreateCollaboratorsCommand.create({ collaborators });
    return this.commandBus.execute(command);
  }

  async listCollaborators(
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
