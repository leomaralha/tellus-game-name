import { AbstractPort } from '@/common/port/abstract-port';
import { Logger } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';
import { Expose, Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import {
  CreateCollaboratorDTO,
  ICollaboratorRepository,
} from '../contracts/collaborator.repository';
import { TellusApiCollaboratorDto } from '../dtos';

export class CreateCollaboratorsCommand extends AbstractPort {
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TellusApiCollaboratorDto)
  public readonly collaborators: TellusApiCollaboratorDto[];
}

export class RawCollaboratorDataMapper {
  toCollaborator(raw: TellusApiCollaboratorDto): CreateCollaboratorDTO {
    return {
      firstName: raw.firstName,
      lastName: raw.lastName,
      jobTitle: raw.jobTitle ?? 'Unknown Position',
      slug: raw.slug,
      imageUrl: raw.headshot?.url ?? '',
      imageAlt:
        raw.headshot?.alt ?? `${raw.firstName} ${raw.lastName} headshot`,
    };
  }
}

@CommandHandler(CreateCollaboratorsCommand)
export class ImportCollaboratorsCommandHandler
  implements ICommandHandler<CreateCollaboratorsCommand>
{
  private readonly mapper: RawCollaboratorDataMapper =
    new RawCollaboratorDataMapper();

  private readonly logger = new Logger(ImportCollaboratorsCommandHandler.name);
  /**
   *
   */
  constructor(private readonly repository: ICollaboratorRepository) {}
  async execute(command: CreateCollaboratorsCommand): Promise<any> {
    try {
      const collaborators = command.collaborators.map((collaborator) =>
        this.mapper.toCollaborator(collaborator),
      );
      await this.repository.save(collaborators);

      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Error importing collaborators', error.stack);
        return { success: false, error: error.message };
      }
      throw error;
    }
  }
}
