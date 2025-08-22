/* eslint-disable prettier/prettier */
import { AbstractPort } from '@/common/port/abstract-port';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, Min } from 'class-validator';
import { type Collaborator } from '../../../domain/aggregates/collaborators';

export class ListCollaboratorsQuery extends AbstractPort {
  @IsInt()
  @Min(1)
  @Expose()
  take: number;
  @IsInt()
  @Min(0)
  @Expose()
  skip: number;
}

export class CollaboratorDTO implements Collaborator {
  @ApiProperty({
    description: 'Unique identifier for the collaborator',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'First name of the collaborator',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'Job title of the collaborator',
    example: 'Software Engineer',
  })
  jobTitle: string;

  @ApiProperty({
    description: 'Last name of the collaborator',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'URL-friendly slug for the collaborator',
    example: 'john-doe',
  })
  slug: string;

  @ApiProperty({
    description: 'URL to the collaborator\'s profile image',
    example: 'https://example.com/images/john-doe.jpg',
  })
  imageUrl: string;

  @ApiProperty({
    description: 'Alternative text for the collaborator\'s image',
    example: 'Profile picture of John Doe',
  })
  imageAlt: string;
}

export class ListCollaboratorsResult {
  @ApiProperty({
    description: 'List of collaborators',
    type: [CollaboratorDTO],
  })
  collaborators: Collaborator[];
}