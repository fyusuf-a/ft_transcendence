import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageOptionsDto } from '@dtos/pages';
import {
  CreateChannelDto,
  QueryChannelDto,
  UpdateChannelDto,
  ResponseChannelDto,
} from '@dtos/channels';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { Channel, ChannelType } from './entities/channel.entity';

import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { paginate } from 'src/common/paginate';

async function hashPassword(rawPassword: string): Promise<string> {
  return await bcrypt.hash(rawPassword, 10);
}

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createChannelDto: CreateChannelDto) {
    const channel: Channel = new Channel();
    channel.type = createChannelDto.type;
    if (channel.type == ChannelType.DIRECT)
      await this.checkDirectUsers(createChannelDto, channel);
    else {
      if (createChannelDto.name[0] == '-')
        throw "Channel name cannot start with a '-'.";
      if (createChannelDto.password) {
        channel.password = await hashPassword(createChannelDto.password);
      } else {
        channel.password = undefined;
      }
      channel.name = createChannelDto.name;
    }
    return await this.channelsRepository.save(channel);
  }

  async checkDirectUsers(createChannelDto: CreateChannelDto, channel: Channel) {
    if (createChannelDto.userOneId > createChannelDto.userTwoId)
      [createChannelDto.userOneId, createChannelDto.userTwoId] = [
        createChannelDto.userTwoId,
        createChannelDto.userOneId,
      ];

    channel.name =
      '-' + createChannelDto.userOneId + '-' + createChannelDto.userTwoId;
    if (
      await this.channelsRepository.findOneByOrFail({
        type: ChannelType.DIRECT,
        name: channel.name,
      })
    )
      throw 'Direct channel already exists.';
    channel.userOne = await this.usersRepository.findOneByOrFail({
      id: createChannelDto.userOneId,
    });
    channel.userTwo = await this.usersRepository.findOneByOrFail({
      id: createChannelDto.userTwoId,
    });
    return;
  }

  async findAll(
    query?: QueryChannelDto,
    pageOptions: PageOptionsDto = new PageOptionsDto(),
  ): Promise<PageDto<ResponseChannelDto>> {
    const orderOptions = { id: pageOptions.order };
    return paginate(this.channelsRepository, query, orderOptions, pageOptions);
  }

  findOne(id: number) {
    return this.channelsRepository.findOneByOrFail({ id: id });
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
