import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUrl,
  IsNumber,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { Type, Expose } from 'class-transformer';

export class HeadshotDto {
  @ApiProperty({
    description: 'Alternative text for the headshot image',
    example: 'John Doe professional headshot',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  alt: string;

  @ApiPropertyOptional({
    description: 'Height of the headshot image in pixels',
    example: 400,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Expose()
  height?: number;

  @ApiProperty({
    description: 'Unique identifier for the headshot',
    example: 'headshot-123-abc',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  id: string;

  @ApiPropertyOptional({
    description: 'MIME type of the headshot image',
    example: 'image/jpeg',
  })
  @IsOptional()
  @IsString()
  @Expose()
  mimeType?: string;

  @ApiProperty({
    description: 'Type of the headshot resource',
    example: 'image',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  type: string;

  @ApiPropertyOptional({
    description: 'URL of the headshot image',
    example: 'https://example.com/images/john-doe.jpg',
  })
  @IsOptional()
  @IsUrl()
  @Expose()
  url?: string;

  @ApiPropertyOptional({
    description: 'Width of the headshot image in pixels',
    example: 400,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Expose()
  width?: number;
}

export class SocialLinkDto {
  @ApiProperty({
    description: 'Call to action text for the social link',
    example: 'Follow on LinkedIn',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  callToAction: string;

  @ApiProperty({
    description: 'Type of social media platform',
    example: 'linkedin',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  type: string;

  @ApiProperty({
    description: 'URL of the social media profile',
    example: 'https://linkedin.com/in/johndoe',
  })
  @IsUrl()
  @IsNotEmpty()
  @Expose()
  url: string;
}

export class TellusApiCollaboratorDto {
  @ApiProperty({
    description: 'First name of the collaborator',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  firstName: string;

  @ApiProperty({
    description: 'Headshot information for the collaborator',
    type: HeadshotDto,
  })
  @ValidateNested()
  @Type(() => HeadshotDto)
  @Expose()
  headshot: HeadshotDto;

  @ApiProperty({
    description: 'Unique identifier for the collaborator',
    example: 'collaborator-123-abc',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  id: string;

  @ApiPropertyOptional({
    description: 'Job title of the collaborator',
    example: 'Senior Software Engineer',
  })
  @IsOptional()
  @IsString()
  @Expose()
  jobTitle?: string;

  @ApiProperty({
    description: 'Last name of the collaborator',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  lastName: string;

  @ApiProperty({
    description: 'URL-friendly slug for the collaborator',
    example: 'john-doe',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  slug: string;

  @ApiProperty({
    description: 'Social media links for the collaborator',
    type: [SocialLinkDto],
    isArray: true,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  @Expose()
  socialLinks: SocialLinkDto[];

  @ApiProperty({
    description: 'Type of collaborator',
    example: 'employee',
  })
  @IsString()
  @IsNotEmpty()
  @Expose()
  type: string;

  @ApiPropertyOptional({
    description: 'Biography of the collaborator',
    example:
      'John is a passionate software engineer with 10+ years of experience...',
  })
  @IsOptional()
  @IsString()
  @Expose()
  bio?: string;
}

export class CreateCollaboratorsDto {
  @ApiProperty({
    description: 'Array of collaborators to import',
    type: [TellusApiCollaboratorDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TellusApiCollaboratorDto)
  @Expose()
  collaborators: TellusApiCollaboratorDto[];
}
