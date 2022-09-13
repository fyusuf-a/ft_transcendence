import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import {
  QueryMembershipDto,
  CreateMembershipDto,
  UpdateMembershipDto,
} from '@dtos/memberships';
import { Membership } from './entities/membership.entity';
import { User } from 'src/users/entities/user.entity';
import { Channel } from 'src/channels/entities/channel.entity';

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

  remove(id: number) {
    return this.membershipRepository.delete(id);
  }
}
