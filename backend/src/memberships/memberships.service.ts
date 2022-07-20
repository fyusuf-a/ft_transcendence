import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityDoesNotExistError } from '../errors/entityDoesNotExist';
import { Repository } from 'typeorm';
import {
  QueryMembershipDto,
  CreateMembershipDto,
  UpdateMembershipDto,
} from '@dtos/memberships';
import { Membership } from './entities/membership.entity';
import UserRepository from 'src/users/repository/user.repository';
import ChannelRepository from 'src/channels/repository/channel.repository';

@Injectable()
export class MembershipsService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
    @InjectRepository(UserRepository)
    private usersRepository: UserRepository,
    @InjectRepository(ChannelRepository)
    private channelsRepository: ChannelRepository,
  ) {}

  async create(createMembershipDto: CreateMembershipDto) {
    const membership: Membership = new Membership();
    membership.role = createMembershipDto.role;
    membership.channel = await this.channelsRepository.findOne(
      createMembershipDto.channelId,
    );
    membership.channelId = createMembershipDto.channelId;
    if (
      membership.channel === undefined ||
      membership.channel.id !== membership.channelId
    ) {
      throw new EntityDoesNotExistError(
        `Channel #${createMembershipDto.channelId}`,
      );
    }
    membership.user = await this.usersRepository.findOne(
      createMembershipDto.userId,
    );
    membership.userId = createMembershipDto.userId;
    if (
      membership.user === undefined ||
      membership.user.id !== membership.userId
    ) {
      throw new EntityDoesNotExistError(`User #${createMembershipDto.userId}`);
    }
    return this.membershipRepository.save(membership);
  }

  findAll(query?: QueryMembershipDto) {
    return this.membershipRepository.find({ where: query });
  }

  findOne(id: number) {
    return this.membershipRepository.findOne(id);
  }

  update(id: number, updateMembershipDto: UpdateMembershipDto) {
    return this.membershipRepository.update(id, updateMembershipDto);
  }

  remove(id: number) {
    return this.membershipRepository.delete(id);
  }
}
