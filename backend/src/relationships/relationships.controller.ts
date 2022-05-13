import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { RelationshipsService } from './relationships.service';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { UpdateRelationshipDto } from './dto/update-relationship.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseRelationshipDto } from './dto/response-relationship.dto';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { QueryRelationshipDto } from './dto/query-relationship.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

@ApiBearerAuth()
@ApiTags('relationships')
@Controller('relationships')
export class RelationshipsController {
  constructor(private readonly relationshipsService: RelationshipsService) {}

  @Post()
  async create(
    @Body() createRelationshipDto: CreateRelationshipDto,
  ): Promise<ResponseRelationshipDto> {
    try {
      return await this.relationshipsService.create(createRelationshipDto);
    } catch (error) {
      if (error instanceof EntityDoesNotExistError) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }

  @Get()
  findAll(
    @Query() query?: QueryRelationshipDto,
  ): Promise<ResponseRelationshipDto[]> {
    return this.relationshipsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ResponseRelationshipDto> {
    return this.relationshipsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRelationshipDto: UpdateRelationshipDto,
  ): Promise<UpdateResult> {
    return this.relationshipsService.update(+id, updateRelationshipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.relationshipsService.remove(+id);
  }
}
