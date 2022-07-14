import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PageDto } from '../common/dto/page.dto';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { QueryChannelDto } from './dto/query-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ResponseChannelDto } from './dto/response-channel.dto';
import { Channel, ChannelType } from './entities/channel.entity';
import ChannelRepository from './repository/channel.repository';
import UserRepository from 'src/users/repository/user.repository';
import * as bcrypt from 'bcrypt';

async function hashPassword(rawPassword: string): Promise<string> {
  return await bcrypt.hash(rawPassword, 10);
}

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(ChannelRepository)
    private channelsRepository: ChannelRepository,
    @InjectRepository(UserRepository)
    private usersRepository: UserRepository,
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
      await this.channelsRepository.findOne({
        where: {
          type: ChannelType.DIRECT,
          name: channel.name,
        },
      })
    )
      throw 'Direct channel already exists.';
    channel.userOne = await this.usersRepository.findOneOrFail(
      createChannelDto.userOneId,
    );
    channel.userTwo = await this.usersRepository.findOneOrFail(
      createChannelDto.userTwoId,
    );
    return;
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
