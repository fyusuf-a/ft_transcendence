import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import {
  QueryMembershipDto,
  CreateMembershipDto,
  UpdateMembershipDto,
  MembershipRoleType,
} from '@dtos/memberships';
import { Membership, MembershipRoleType } from './entities/membership.entity';
import { User } from 'src/users/entities/user.entity';
import { Channel, ChannelType } from 'src/channels/entities/channel.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MembershipsService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
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
    return this.membershipRepository.save(membership);
  }

  findAll(query?: QueryMembershipDto) {
    const findOptionsWhere: FindOptionsWhere<Membership> = {
      channel: query?.channel ? { id: +query.channel } : {},
      user: query?.user ? { id: +query.user } : {},
      role: query?.role,
      mutedUntil: query?.mutedUntil,
      bannedUntil: query?.bannedUntil,
    };
    return this.membershipRepository.find({ where: findOptionsWhere });
  }

  findOne(id: number) {
    return this.membershipRepository.findOneByOrFail({ id: id });
  }

  update(id: number, updateMembershipDto: UpdateMembershipDto) {
    return this.membershipRepository.update(id, updateMembershipDto);
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
    }
    return this.membershipRepository.delete(id);
  }

  async userIsAdmin(userId: number, channelId: number): Promise<boolean> {
    const creatorMembership = await this.findAll({
      user: userId.toString(),
      channel: channelId.toString(),
    });
    if (
      creatorMembership.length === 1 &&
      (creatorMembership[0].role === MembershipRoleType.ADMIN ||
        creatorMembership[0].role === MembershipRoleType.OWNER)
    ) {
      return true;
    }
    return false;
  }

  async userIsOwner(userId: number, channelId: number): Promise<boolean> {
    const creatorMembership = await this.findAll({
      user: userId.toString(),
      channel: channelId.toString(),
    });
    if (
      creatorMembership.length === 1 &&
      creatorMembership[0].role === MembershipRoleType.OWNER
    ) {
      return true;
    }
    return false;
  }

  async isAuthorized(
    createMembershipDto: CreateMembershipDto,
    user: User,
    channel: Channel,
  ) {
    let isAuthorized = false;
    if (createMembershipDto.role === MembershipRoleType.OWNER) {
      throw new UnauthorizedException();
    }
    if (createMembershipDto.role === MembershipRoleType.ADMIN) {
      if (!(await this.userIsOwner(user.id, channel.id))) {
        throw new UnauthorizedException();
      }
    }
    if (channel.type === ChannelType.PRIVATE) {
      isAuthorized = await this.userIsAdmin(
        user.id,
        createMembershipDto.channelId,
      );
    } else if (channel.type === ChannelType.PROTECTED) {
      isAuthorized =
        createMembershipDto.password &&
        (await bcrypt.compare(createMembershipDto.password, channel.password));
    } else {
      isAuthorized = true;
    }
    if (!isAuthorized) {
      throw new UnauthorizedException();
    }
  }
}
