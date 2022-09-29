import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BlocksService } from './blocks.service';
import {
  CreateBlockDto,
  UpdateBlockDto,
  ResponseBlockDto,
  QueryBlockDto,
} from '@dtos/blocks';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
    return await this.blocksService.create(createblockDto);
  }

  @Post(':username')
  async createFromUsername(
    @Param('username') username: string,
    @Body() createfriendshipDto: CreateBlockDto,
  ): Promise<ResponseBlockDto> {
    return await this.blocksService.createFromUsername(
      username,
      createfriendshipDto,
    );
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
