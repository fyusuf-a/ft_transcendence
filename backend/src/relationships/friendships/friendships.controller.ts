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
import { FriendshipsService } from './friendships.service';
import {
  QueryFriendshipDto,
  CreateFriendshipDto,
  UpdateFriendshipDto,
  ResponseFriendshipDto,
} from '@dtos/friendships';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PageDto } from '@dtos/pages';

@ApiBearerAuth()
@ApiTags('friendships')
@Controller('friendships')
export class FriendshipsController {
  constructor(private readonly friendshipsService: FriendshipsService) {}

  @Post()
  async create(
    @Body() createfriendshipDto: CreateFriendshipDto,
  ): Promise<ResponseFriendshipDto> {
    return await this.friendshipsService.create(createfriendshipDto);
  }

  @Get()
  findAll(
    @Query() query?: QueryFriendshipDto,
  ): Promise<PageDto<ResponseFriendshipDto>> {
    return this.friendshipsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ResponseFriendshipDto> {
    return this.friendshipsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatefriendshipDto: UpdateFriendshipDto,
  ): Promise<UpdateResult> {
    return this.friendshipsService.update(+id, updatefriendshipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.friendshipsService.remove(+id);
  }
}
