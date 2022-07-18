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
import { FriendshipsService } from './friendships.service';
import {
  QueryFriendshipDto,
  CreateFriendshipDto,
  UpdateFriendshipDto,
  ResponseFriendshipDto,
} from '@dtos/friendships';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
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
    try {
      return await this.friendshipsService.create(createfriendshipDto);
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
