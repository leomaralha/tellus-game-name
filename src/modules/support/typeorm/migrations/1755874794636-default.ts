import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class Default1755874794636 implements MigrationInterface {
  name = 'Default1755874794636';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "collaborators" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(100) NOT NULL, "jobTitle" character varying(200) NOT NULL, "lastName" character varying(100) NOT NULL, "slug" character varying(150) NOT NULL, "imageUrl" text NOT NULL, "imageAlt" character varying(255) NOT NULL, CONSTRAINT "PK_f579a5df9d66287f400806ad875" PRIMARY KEY ("id"))',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "collaborators"');
  }
}
