import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityDoesNotExistError } from '../errors/entityDoesNotExist';
import { Repository } from 'typeorm';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Membership } from './entities/membership.entity';
import { Channel } from 'src/channels/entities/channel.entity';
import { User } from 'src/users/entities/user.entity';
import { QueryMembershipDto } from './dto/query-membership.dto';

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
