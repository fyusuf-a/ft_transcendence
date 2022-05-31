import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PageDto } from '../common/dto/page.dto';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { QueryChannelDto } from './dto/query-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ResponseChannelDto } from './dto/response-channel.dto';
import { Channel } from './entities/channel.entity';
import ChannelRepository from './repository/channel.repository';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(ChannelRepository)
    private channelsRepository: ChannelRepository,
  ) {}

  create(createChannelDto: CreateChannelDto) {
    const channel: Channel = new Channel();
    channel.name = createChannelDto.name;
    channel.type = createChannelDto.type;
    channel.password = createChannelDto.password;
    return this.channelsRepository.save(channel);
  }

  async findAll(
    query?: QueryChannelDto,
    pageOptions?: PageOptionsDto,
  ): Promise<PageDto<ResponseChannelDto>> {
    return this.channelsRepository.findAllPaginated(query, pageOptions);
  }

  findOne(id: number) {
    return this.channelsRepository.findOne(id);
  }

  update(
    id: number,
    updateChannelDto: UpdateChannelDto,
  ): Promise<UpdateResult> {
    return this.channelsRepository.update(id, updateChannelDto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.channelsRepository.delete(id);
  }
}
