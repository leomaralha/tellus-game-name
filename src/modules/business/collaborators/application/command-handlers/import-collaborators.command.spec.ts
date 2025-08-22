import { Test, type TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { DataSource } from 'typeorm';
import {
  CreateCollaboratorsCommand,
  ImportCollaboratorsCommandHandler,
} from './import-collaborators.command';
import { ICollaboratorRepository } from '../contracts/collaborator.repository';
import { TypeOrmCollaboratorRepository } from '../../infra/adapters/persistence/typeorm/repositories/typeorm-collaborator.repository';
import { CollaboratorEntity } from '@/modules/support/typeorm/entities/collaborator.entity';
import type { TellusApiCollaboratorDto, HeadshotDto } from '../dtos';

type CommandResult = {
  success: boolean;
  error?: string;
};

describe('ImportCollaboratorsCommandHandler', () => {
  let module: TestingModule;
  let handler: ImportCollaboratorsCommandHandler;
  let repository: ICollaboratorRepository;
  let dataSource: DataSource;

  const testDatabaseConfig = {
    type: 'postgres' as const,
    host: 'localhost',
    port: 5432,
    username: 'tellus',
    password: 'tellus123',
    database: 'tellus_db',
    entities: [CollaboratorEntity],
    synchronize: false,
    logging: false,
    dropSchema: false,
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(testDatabaseConfig),
        TypeOrmModule.forFeature([CollaboratorEntity]),
        CqrsModule,
      ],
      providers: [
        ImportCollaboratorsCommandHandler,
        {
          provide: ICollaboratorRepository,
          useClass: TypeOrmCollaboratorRepository,
        },
      ],
    }).compile();

    handler = module.get<ImportCollaboratorsCommandHandler>(
      ImportCollaboratorsCommandHandler,
    );
    repository = module.get<ICollaboratorRepository>(ICollaboratorRepository);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await module.close();
  });

  beforeEach(async () => {
    // Clean up the collaborators table before each test
    await dataSource.query('DELETE FROM collaborators');
  });

  describe('execute', () => {
    it('should successfully import collaborators to the database', async () => {
      // Arrange
      const mockHeadshot: HeadshotDto = {
        alt: 'John Doe headshot',
        id: 'headshot-123',
        type: 'image',
        url: 'https://example.com/john-doe.jpg',
        height: 400,
        width: 400,
        mimeType: 'image/jpeg',
      };

      const mockCollaborators: TellusApiCollaboratorDto[] = [
        {
          id: 'collab-1',
          firstName: 'John',
          lastName: 'Doe',
          jobTitle: 'Senior Software Engineer',
          slug: 'john-doe',
          headshot: mockHeadshot,
          socialLinks: [],
          type: 'employee',
          bio: 'A passionate software engineer',
        },
        {
          id: 'collab-2',
          firstName: 'Jane',
          lastName: 'Smith',
          jobTitle: 'Product Manager',
          slug: 'jane-smith',
          headshot: {
            ...mockHeadshot,
            id: 'headshot-456',
            alt: 'Jane Smith headshot',
            url: 'https://example.com/jane-smith.jpg',
          },
          socialLinks: [],
          type: 'employee',
          bio: 'Experienced product manager',
        },
      ];

      const command = new CreateCollaboratorsCommand();
      Object.assign(command, { collaborators: mockCollaborators });

      // Act
      const result = (await handler.execute(command)) as CommandResult;

      // Assert
      expect(result).toEqual({ success: true });

      // Verify data was saved to database
      const savedCollaborators = await repository.list({});
      expect(savedCollaborators).toHaveLength(2);

      const johnDoe = savedCollaborators.find((c) => c.slug === 'john-doe');
      expect(johnDoe).toBeDefined();
      expect(johnDoe?.firstName).toBe('John');
      expect(johnDoe?.lastName).toBe('Doe');
      expect(johnDoe?.jobTitle).toBe('Senior Software Engineer');
      expect(johnDoe?.imageUrl).toBe('https://example.com/john-doe.jpg');
      expect(johnDoe?.imageAlt).toBe('John Doe headshot');

      const janeSmith = savedCollaborators.find((c) => c.slug === 'jane-smith');
      expect(janeSmith).toBeDefined();
      expect(janeSmith?.firstName).toBe('Jane');
      expect(janeSmith?.lastName).toBe('Smith');
      expect(janeSmith?.jobTitle).toBe('Product Manager');
      expect(janeSmith?.imageUrl).toBe('https://example.com/jane-smith.jpg');
      expect(janeSmith?.imageAlt).toBe('Jane Smith headshot');
    });

    it('should handle collaborators with missing job titles', async () => {
      // Arrange
      const mockCollaborators: TellusApiCollaboratorDto[] = [
        {
          id: 'collab-3',
          firstName: 'Bob',
          lastName: 'Wilson',
          slug: 'bob-wilson',
          headshot: {
            alt: 'Bob Wilson headshot',
            id: 'headshot-789',
            type: 'image',
            url: 'https://example.com/bob-wilson.jpg',
          },
          socialLinks: [],
          type: 'contractor',
        },
      ];

      const command = new CreateCollaboratorsCommand();
      Object.assign(command, { collaborators: mockCollaborators });

      // Act
      const result = (await handler.execute(command)) as CommandResult;

      // Assert
      expect(result).toEqual({ success: true });

      const savedCollaborators = await repository.list({});
      expect(savedCollaborators).toHaveLength(1);

      const bobWilson = savedCollaborators[0];
      expect(bobWilson.firstName).toBe('Bob');
      expect(bobWilson.lastName).toBe('Wilson');
      expect(bobWilson.jobTitle).toBe('Unknown Position');
      expect(bobWilson.slug).toBe('bob-wilson');
    });

    it('should handle collaborators with missing headshot URL', async () => {
      // Arrange
      const mockCollaborators: TellusApiCollaboratorDto[] = [
        {
          id: 'collab-4',
          firstName: 'Alice',
          lastName: 'Johnson',
          jobTitle: 'Designer',
          slug: 'alice-johnson',
          headshot: {
            alt: 'Alice Johnson headshot',
            id: 'headshot-101',
            type: 'image',
            // No URL provided
          },
          socialLinks: [],
          type: 'employee',
        },
      ];

      const command = new CreateCollaboratorsCommand();
      Object.assign(command, { collaborators: mockCollaborators });

      // Act
      const result = (await handler.execute(command)) as CommandResult;

      // Assert
      expect(result).toEqual({ success: true });

      const savedCollaborators = await repository.list({});
      expect(savedCollaborators).toHaveLength(1);

      const aliceJohnson = savedCollaborators[0];
      expect(aliceJohnson.firstName).toBe('Alice');
      expect(aliceJohnson.lastName).toBe('Johnson');
      expect(aliceJohnson.jobTitle).toBe('Designer');
      expect(aliceJohnson.imageUrl).toBe('');
      expect(aliceJohnson.imageAlt).toBe('Alice Johnson headshot');
    });

    it('should handle collaborators with missing headshot alt text', async () => {
      // Arrange
      const mockCollaborators: TellusApiCollaboratorDto[] = [
        {
          id: 'collab-5',
          firstName: 'Charlie',
          lastName: 'Brown',
          jobTitle: 'Developer',
          slug: 'charlie-brown',
          headshot: {
            id: 'headshot-202',
            type: 'image',
            url: 'https://example.com/charlie-brown.jpg',
            // No alt text provided
          } as HeadshotDto,
          socialLinks: [],
          type: 'employee',
        },
      ];

      const command = new CreateCollaboratorsCommand();
      Object.assign(command, { collaborators: mockCollaborators });

      // Act
      const result = (await handler.execute(command)) as CommandResult;

      // Assert
      expect(result).toEqual({ success: true });

      const savedCollaborators = await repository.list({});
      expect(savedCollaborators).toHaveLength(1);

      const charlieBrown = savedCollaborators[0];
      expect(charlieBrown.firstName).toBe('Charlie');
      expect(charlieBrown.lastName).toBe('Brown');
      expect(charlieBrown.imageUrl).toBe(
        'https://example.com/charlie-brown.jpg',
      );
      expect(charlieBrown.imageAlt).toBe('Charlie Brown headshot');
    });

    it('should return error result when database operation fails', async () => {
      // Arrange
      const mockCollaborators: TellusApiCollaboratorDto[] = [
        {
          id: 'collab-6',
          firstName: 'Invalid',
          lastName: 'User',
          jobTitle: 'A'.repeat(201), // Exceeds VARCHAR(200) limit
          slug: 'invalid-user',
          headshot: {
            alt: 'Invalid User headshot',
            id: 'headshot-303',
            type: 'image',
            url: 'https://example.com/invalid-user.jpg',
          },
          socialLinks: [],
          type: 'employee',
        },
      ];

      const command = new CreateCollaboratorsCommand();
      Object.assign(command, { collaborators: mockCollaborators });

      // Act
      const result = (await handler.execute(command)) as CommandResult;

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(typeof result.error).toBe('string');

      // Verify no data was saved
      const savedCollaborators = await repository.list({});
      expect(savedCollaborators).toHaveLength(0);
    });

    it('should handle empty collaborators array', async () => {
      // Arrange
      const command = new CreateCollaboratorsCommand();
      Object.assign(command, { collaborators: [] });

      // Act
      const result = (await handler.execute(command)) as CommandResult;

      // Assert
      expect(result).toEqual({ success: true });

      const savedCollaborators = await repository.list({});
      expect(savedCollaborators).toHaveLength(0);
    });
  });
});
