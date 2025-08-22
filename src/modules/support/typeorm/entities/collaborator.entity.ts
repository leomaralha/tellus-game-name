import type { Collaborator } from '@/modules/business/collaborators/domain/aggregates/collaborators';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('collaborators')
export class CollaboratorEntity implements Collaborator {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 200 })
  jobTitle: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 150 })
  slug: string;

  @Column({ type: 'text' })
  imageUrl: string;

  @Column({ type: 'varchar', length: 255 })
  imageAlt: string;
}
