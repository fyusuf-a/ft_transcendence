import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { Channel } from './entities/channel.entity';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) {}

  create(createChannelDto: CreateChannelDto) {
    const channel: Channel = new Channel();
    channel.name = createChannelDto.name;
    channel.type = createChannelDto.type;
    channel.password = createChannelDto.password;
    return this.channelRepository.save(channel);
  }

  findAll() {
    return this.channelRepository.find();
  }

  findOne(id: number) {
    return this.channelRepository.findOne(id);
  }

  update(
    id: number,
    updateChannelDto: UpdateChannelDto,
  ): Promise<UpdateResult> {
    return this.channelRepository.update(id, updateChannelDto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.channelRepository.delete(id);
  }
}
