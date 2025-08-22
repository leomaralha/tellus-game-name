import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CollaboratorFacadeService } from '../../../../application/services/collaborator.facade.service';
import { CreateCollaboratorsDto } from '../../../../application/dtos';
import { ListCollaboratorsResult } from '../../../../application/query-handlers/list-collaborators/types';

@Controller('collaborators')
@ApiTags('Collaborators')
export class CollaboratorController {
  constructor(
    private readonly collaboratorFacadeService: CollaboratorFacadeService,
  ) {}

  @Post('import')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Import collaborators',
    description: 'Import a list of collaborators from external API',
  })
  @ApiResponse({
    status: 200,
    description: 'Collaborators imported successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        error: { type: 'string' },
      },
    },
  })
  async importCollaborators(
    @Body() request: CreateCollaboratorsDto,
  ): Promise<{ success: boolean; error?: string }> {
    return this.collaboratorFacadeService.importCollaborators(
      request.collaborators,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'List collaborators',
    description: 'Get a paginated list of collaborators',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Number of collaborators to return',
    example: 10,
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Number of collaborators to skip',
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'List of collaborators',
    type: ListCollaboratorsResult,
  })
  async listCollaborators(
    @Query('take') take: number = 10,
    @Query('skip') skip: number = 0,
  ): Promise<ListCollaboratorsResult> {
    return this.collaboratorFacadeService.listCollaborators(take, skip);
  }
}
