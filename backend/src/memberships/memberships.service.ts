import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelsService } from '../channels/channels.service';
import { EntityDoesNotExistError } from '../errors/entityDoesNotExist';
import { UsersService } from '../users/users.service';
import { Repository } from 'typeorm';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Membership } from './entities/membership.entity';

@Injectable()
export class MembershipsService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>,
    private usersService: UsersService,
    private channelsService: ChannelsService,
  ) {}

  async create(createMembershipDto: CreateMembershipDto) {
    let membership: Membership = new Membership;
    membership.role = createMembershipDto.role;
    membership.channel = await this.channelsService.findOne(createMembershipDto.channelId);
    membership.channelId = createMembershipDto.channelId;
    if (membership.channel === undefined || membership.channel.id !== membership.channelId) {
      throw new EntityDoesNotExistError(`Channel #${createMembershipDto.channelId}`)
    }
    membership.user = await this.usersService.findOne(createMembershipDto.userId);
    membership.userId = createMembershipDto.userId;
    if (membership.user === undefined || membership.user.id !== membership.userId) {
      throw new EntityDoesNotExistError(`User #${createMembershipDto.userId}`)
    }
    return this.membershipRepository.save(membership);
  }

  findAll() {
    return this.membershipRepository.find();
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
