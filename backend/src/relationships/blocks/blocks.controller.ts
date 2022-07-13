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
import { BlocksService } from './blocks.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseBlockDto } from './dto/response-block.dto';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { QueryBlockDto } from './dto/query-block.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

@ApiBearerAuth()
@ApiTags('blocks')
@Controller('blocks')
export class BlocksController {
  constructor(private readonly blocksService: BlocksService) {}

  @Post()
  async create(
    @Body() createblockDto: CreateBlockDto,
  ): Promise<ResponseBlockDto> {
    try {
      return await this.blocksService.create(createblockDto);
    } catch (error) {
      if (error instanceof EntityDoesNotExistError) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }

  @Get()
  findAll(@Query() query?: QueryBlockDto): Promise<ResponseBlockDto[]> {
    return this.blocksService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ResponseBlockDto> {
    return this.blocksService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateblockDto: UpdateBlockDto,
  ): Promise<UpdateResult> {
    return this.blocksService.update(+id, updateblockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.blocksService.remove(+id);
  }
}
