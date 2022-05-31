import {
  Controller,
  Get,
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
import { DeleteResult, UpdateResult } from 'typeorm';
import { PageDto } from '../common/dto/page.dto';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { QueryChannelDto } from './dto/query-channel.dto';
import { ResponseChannelDto } from './dto/response-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ChannelsService } from './channels.service';
import { Channel } from './entities/channel.entity';

@ApiBearerAuth()
@ApiTags('channels')
@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @ApiBody({ type: CreateChannelDto })
  @Post()
  create(
    @Body() createChannelDto: CreateChannelDto,
  ): Promise<CreateChannelDto> {
    return this.channelsService.create(createChannelDto);
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
    const channel: Channel = await this.channelsService.findOne(+id);
    if (channel === undefined) {
      throw new NotFoundException(`Channel #${id} not found`);
    }
    return channel;
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
