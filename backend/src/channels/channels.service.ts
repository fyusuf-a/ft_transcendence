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
import { Membership } from 'src/memberships/entities/membership.entity';

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
    @InjectRepository(Membership)
    private membershipsRepository: Repository<Membership>,
    private membershipsService: MembershipsService,
  ) {}

  async create(
    createChannelDto: CreateChannelDto,
  ): Promise<ResponseChannelDto> {
    const channel: Channel = new Channel();
    let ret: ResponseChannelDto;
    let role: MembershipRoleType = MembershipRoleType.PARTICIPANT;
    const userId: number = +createChannelDto.userId;

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
      await this.usersRepository.findOneByOrFail({
        id: +createChannelDto.userId,
      });
      channel.name = createChannelDto.name;
      ret = await this.channelsRepository.save(channel);
      role = MembershipRoleType.OWNER;
    }
    this.membershipsService.create({
      userId: userId,
      role: role,
      channelId: channel.id,
    });
    return ret;
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
    //const user : User = this.usersRepository.findOneByOrFail( {id: userId} );
    this.membershipsService.create({
      userId: +createChannelDto.userId,
      role: MembershipRoleType.PARTICIPANT,
      channelId: channel.id,
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

  async remove(id: number): Promise<DeleteResult> {
    await this.membershipsRepository.delete({ channelId: id });
    return this.channelsRepository.delete(id);
  }
}
