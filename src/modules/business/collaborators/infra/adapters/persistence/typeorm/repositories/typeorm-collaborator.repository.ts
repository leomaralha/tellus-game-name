import type {
  ICollaboratorRepository,
  IListCriteria,
} from '@/modules/business/collaborators/application/contracts/collaborator.repository';
import { Collaborator } from '@/modules/business/collaborators/domain/aggregates/collaborators';
import { CollaboratorEntity } from '@/modules/support/typeorm/entities/collaborator.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TypeOrmCollaboratorRepository implements ICollaboratorRepository {
  constructor(
    @InjectRepository(CollaboratorEntity)
    private readonly repository: Repository<CollaboratorEntity>,
  ) {}

  async save(collaborators: Collaborator[]): Promise<void> {
    const entities = collaborators.map((collaborator) =>
      this.repository.create({
        id: collaborator.id,
        firstName: collaborator.firstName,
        lastName: collaborator.lastName,
        jobTitle: collaborator.jobTitle,
        slug: collaborator.slug,
        imageUrl: collaborator.imageUrl,
        imageAlt: collaborator.imageAlt,
      }),
    );

    await this.repository.save(entities);
  }

  async list(criteria: IListCriteria): Promise<Collaborator[]> {
    const queryBuilder = this.repository.createQueryBuilder('collaborator');

    if (criteria.exceptIds && criteria.exceptIds.length > 0) {
      queryBuilder.where('collaborator.id NOT IN (:...exceptIds)', {
        exceptIds: criteria.exceptIds,
      });
    }

    const entities = await queryBuilder.getMany();
    return entities;
  }
}
