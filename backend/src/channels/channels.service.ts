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
import { MembershipsService } from 'src/memberships/memberships.service';
import { MembershipRoleType } from 'src/dtos/memberships';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';

async function hashPassword(
  rawPassword: string,
  rounds: number,
): Promise<string> {
  return await bcrypt.hash(rawPassword, rounds);
}

@Injectable()
export class ChannelsService {
  saltRounds: number;

  constructor(
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private membershipsService: MembershipsService,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {
    this.saltRounds = parseInt(this.configService.get('BACKEND_SALT_ROUNDS'));
  }

  async create(
    createChannelDto: CreateChannelDto,
  ): Promise<ResponseChannelDto> {
    let channel: Channel = new Channel();
    let ret: ResponseChannelDto;
    let role: MembershipRoleType = MembershipRoleType.PARTICIPANT;
    const userId: number = +createChannelDto.userId;

    channel.type = createChannelDto.type;
    if (channel.type == ChannelType.DIRECT)
      return await this.createDirectChannel(createChannelDto, channel);
    else {
      if (createChannelDto.name[0] == '-')
        throw "Channel name cannot start with a '-'.";
      if (createChannelDto.password) {
        channel.password = await hashPassword(
          createChannelDto.password,
          this.saltRounds,
        );
      } else {
        channel.password = undefined;
      }
      await this.usersRepository.findOneByOrFail({
        id: +createChannelDto.userId,
      });
      channel.name = createChannelDto.name;
      channel = await this.channelsRepository.save(channel);
      ret = { id: channel.id, name: channel.name, type: channel.type };
      role = MembershipRoleType.OWNER;
      await this.membershipsService.create({
        userId: userId,
        role: role,
        channelId: channel.id,
      });
    }
    return ret;
  }

  async createDirectChannel(
    createChannelDto: CreateChannelDto,
    channel: Channel,
  ): Promise<Channel> {
    if (!createChannelDto.userOneId || !createChannelDto.userTwoId)
      throw 'User 1 or user 2 is not defined.';
    if (createChannelDto.userOneId > createChannelDto.userTwoId)
      [createChannelDto.userOneId, createChannelDto.userTwoId] = [
        createChannelDto.userTwoId,
        createChannelDto.userOneId,
      ];

    channel.name =
      '-' + createChannelDto.userOneId + '-' + createChannelDto.userTwoId;
    channel.userOne = await this.usersRepository.findOneByOrFail({
      id: createChannelDto.userOneId,
    });
    channel.userTwo = await this.usersRepository.findOneByOrFail({
      id: createChannelDto.userTwoId,
    });

    const ret: Channel = await this.channelsRepository.save(channel);
    this.membershipsService.create({
      userId: +createChannelDto.userOneId,
      role: MembershipRoleType.PARTICIPANT,
      channelId: channel.id,
    });
    this.membershipsService.create({
      userId: +createChannelDto.userTwoId,
      role: MembershipRoleType.PARTICIPANT,
      channelId: channel.id,
    });
    return ret;
  }

  async findAll(
    query?: QueryChannelDto,
    pageOptions: PageOptionsDto = new PageOptionsDto(),
  ): Promise<PageDto<ResponseChannelDto>> {
    const orderOptions = { id: pageOptions.order };
    const pageDto: PageDto<ResponseChannelDto> =
      await paginate<ResponseChannelDto>(
        this.channelsRepository,
        query,
        orderOptions,
        pageOptions,
      );
    let i = 0;
    for (const dto of pageDto.data) {
      pageDto.data[i] = {
        id: dto.id,
        type: dto.type,
        name: dto.name,
        userOneId: dto.userOneId,
        userTwoId: dto.userTwoId,
      };
      i++;
    }
    return pageDto;
  }

  async findOne(id: number): Promise<Channel> {
    return await this.channelsRepository.findOneByOrFail({
      id: id,
    });
  }

  async update(
    id: number,
    updateChannelDto: UpdateChannelDto,
  ): Promise<UpdateResult> {
    if (updateChannelDto.password) {
      updateChannelDto.password = await hashPassword(
        updateChannelDto.password,
        this.saltRounds,
      );
    }
    const result = await this.channelsRepository.update(id, updateChannelDto);
    this.eventEmitter.emit('channel.updated', id);
    return result;
  }

  async remove(id: number): Promise<DeleteResult> {
    const result = await this.channelsRepository.delete(id);
    this.eventEmitter.emit('channel.deleted', id);
    return result;
  }
}
