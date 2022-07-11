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
import * as bcrypt from 'bcrypt';

async function hashPassword(rawPassword: string): Promise<string> {
  return await bcrypt.hash(rawPassword, 10);
}

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(ChannelRepository)
    private channelsRepository: ChannelRepository,
  ) {}

  async create(createChannelDto: CreateChannelDto) {
    const channel: Channel = new Channel();
    channel.name = createChannelDto.name;
    channel.type = createChannelDto.type;
    if (createChannelDto.password) {
      channel.password = await hashPassword(createChannelDto.password);
    } else {
      channel.password = undefined;
    }
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

  async update(
    id: number,
    updateChannelDto: UpdateChannelDto,
  ): Promise<UpdateResult> {
    if (updateChannelDto.password) {
      updateChannelDto.password = await hashPassword(updateChannelDto.password);
    }
    return this.channelsRepository.update(id, updateChannelDto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.channelsRepository.delete(id);
  }
}
