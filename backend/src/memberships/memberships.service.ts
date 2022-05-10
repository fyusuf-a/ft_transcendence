import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Membership } from './entities/membership.entity';

@Injectable()
export class MembershipsService {
  constructor(
    @InjectRepository(Membership)
    private membershipRepository: Repository<Membership>
  ) {}

  create(createMembershipDto: CreateMembershipDto) {
    return this.membershipRepository.save(createMembershipDto);
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
