import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PageDto, PageOptionsDto } from '@dtos/pages';
import {
  ResponseChannelDto,
  CreateChannelDto,
  UpdateChannelDto,
  QueryChannelDto,
} from '@dtos/channels';
import { DeleteResult, EntityNotFoundError, UpdateResult } from 'typeorm';
import { ChannelsService } from './channels.service';
import { Channel } from './entities/channel.entity';

@ApiBearerAuth()
@ApiTags('channels')
@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @ApiBody({ type: CreateChannelDto })
  @Post()
  async create(
    @Body() createChannelDto: CreateChannelDto,
  ): Promise<CreateChannelDto> {
    let ret: Channel;

    try {
      ret = await this.channelsService.create(createChannelDto);
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }

    return ret;
  }

  @Get()
  async findAll(
    @Query() query?: QueryChannelDto,
    @Query() pageOptions?: PageOptionsDto,
  ): Promise<PageDto<ResponseChannelDto>> {
    return await this.channelsService.findAll(query, pageOptions);
  }

  @Get(':id')
  @ApiNotFoundResponse({ description: 'Channel Not Found' })
  async findOne(@Param('id') id: string): Promise<ResponseChannelDto> {
    try {
      return await this.channelsService.findOne(+id);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`Channel #${id} not found`);
      }
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChannelDto: UpdateChannelDto,
  ): Promise<UpdateResult> {
    return this.channelsService.update(+id, updateChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.channelsService.remove(+id);
  }
}
