import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import {
  QueryMembershipDto,
  CreateMembershipDto,
  UpdateMembershipDto,
} from '@dtos/memberships';
import { Membership, MembershipRoleType } from './entities/membership.entity';
import { User } from 'src/users/entities/user.entity';
import { Channel, ChannelType } from 'src/channels/entities/channel.entity';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';

type Inability = {
  muted: boolean | undefined;
  banned: boolean | undefined;
};

@Injectable()
export class MembershipsService {
  constructor(
    protected readonly configService: ConfigService,
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createMembershipDto: CreateMembershipDto) {
    const membership: Membership = new Membership();
    membership.role = createMembershipDto.role;
    membership.channel = await this.channelsRepository.findOneByOrFail({
      id: createMembershipDto.channelId,
    });
    membership.channelId = createMembershipDto.channelId;
    membership.user = await this.usersRepository.findOneByOrFail({
      id: createMembershipDto.userId,
    });
    const result = await this.membershipRepository.save(membership);
    this.eventEmitter.emit('membership.updated', membership.userId);
    return result;
  }

  async findAll(query?: QueryMembershipDto) {
    const findOptionsWhere: FindOptionsWhere<Membership> = {
      channel: query?.channel ? { id: +query.channel } : {},
      user: query?.user ? { id: +query.user } : {},
      role: query?.role,
      mutedUntil: query?.mutedUntil,
      bannedUntil: query?.bannedUntil,
    };
    const memberships: Membership[] = await this.membershipRepository.find({
      where: findOptionsWhere,
    });
    //if (findOptionsWhere.user) {
    for (const membership of memberships) {
      if (
        membership.bannedUntil != null &&
        membership.bannedUntil > new Date()
      ) {
        memberships.splice(memberships.indexOf(membership), 1);
      }
      //  }
    }
    return memberships;
  }

  findOne(id: number) {
    return this.membershipRepository.findOneByOrFail({ id: id });
  }

  async update(id: number, updateMembershipDto: UpdateMembershipDto) {
    const result = await this.membershipRepository.update(
      id,
      updateMembershipDto,
    );
    const membership = await this.findOne(id);
    this.eventEmitter.emit('membership.updated', membership.userId);
    return result;
  }

  async remove(id: number) {
    const membership = await this.findOne(id);
    const channel = await this.channelsRepository.findOneByOrFail({
      id: membership.channelId,
    });
    if (
      membership.role === MembershipRoleType.OWNER ||
      (channel && channel?.type === ChannelType.DIRECT)
    ) {
      this.channelsRepository.delete(channel.id);
      this.eventEmitter.emit('channel.deleted', channel.id);
    }
    const result = await this.membershipRepository.delete(id);
    this.eventEmitter.emit('membership.updated', membership.userId);
    return result;
  }

  async isUserAtLeastAdmin(user: User, channelId: string) {
    const memberships = await this.findAll({
      channel: channelId,
      user: user.id.toString(),
    });
    if (
      memberships.length === 0 ||
      memberships[0].role === MembershipRoleType.PARTICIPANT
    )
      throw new ForbiddenException();
  }

  async hasUserRoleInChannel(
    user: User,
    role: MembershipRoleType,
    channelId: string,
  ) {
    const memberships = await this.findAll({
      channel: channelId,
      user: user.id.toString(),
    });
    if (memberships.length === 0 || memberships[0].role !== role)
      throw new ForbiddenException();
  }

  async isUserCapableInChannel(
    user: User,
    channelId: string,
    inability: Inability,
  ) {
    const memberships = await this.findAll({
      channel: channelId,
      user: user.id.toString(),
    });
    if (memberships.length === 0) throw new ForbiddenException();
    const membership = memberships[0];
    const date = new Date();
    if (inability.banned === false && date < membership.bannedUntil) {
      throw new ForbiddenException();
    }
    if (inability.muted === false && date < membership.mutedUntil) {
      throw new ForbiddenException();
    }
  }

  async isUserMembershipTarget(user: User, membershipId: string) {
    const membership = await this.findOne(+membershipId);
    if (!user.id || membership?.userId !== user.id) {
      throw new ForbiddenException();
    }
  }
}
