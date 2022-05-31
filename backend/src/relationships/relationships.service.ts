import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import UserRepository from 'src/users/repository/user.repository';
import { Repository } from 'typeorm';
import { CreateRelationshipDto } from './dto/create-relationship.dto';
import { QueryRelationshipDto } from './dto/query-relationship.dto';
import { UpdateRelationshipDto } from './dto/update-relationship.dto';
import { Relationship } from './entities/relationship.entity';

@Injectable()
export class RelationshipsService {
  constructor(
    @InjectRepository(Relationship)
    private relationshipRepository: Repository<Relationship>,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async create(createRelationshipDto: CreateRelationshipDto) {
    const relationship: Relationship = new Relationship();
    relationship.type = createRelationshipDto.type;
    relationship.source = await this.userRepository.findOne(
      createRelationshipDto.sourceId,
    );
    relationship.sourceId = createRelationshipDto.sourceId;
    if (
      relationship.source === undefined ||
      relationship.source.id !== relationship.sourceId
    ) {
      throw new EntityDoesNotExistError(
        `User #${createRelationshipDto.sourceId}`,
      );
    }

    relationship.target = await this.userRepository.findOne(
      createRelationshipDto.targetId,
    );
    relationship.targetId = createRelationshipDto.targetId;
    if (
      relationship.target === undefined ||
      relationship.target.id !== relationship.targetId
    ) {
      throw new EntityDoesNotExistError(
        `User #${createRelationshipDto.targetId}`,
      );
    }
    return this.relationshipRepository.save(relationship);
  }

  findAll(query?: QueryRelationshipDto) {
    return this.relationshipRepository.find({ where: query });
  }

  findOne(id: number) {
    return this.relationshipRepository.findOne(id);
  }

  update(id: number, updateRelationshipDto: UpdateRelationshipDto) {
    return this.relationshipRepository.update(id, updateRelationshipDto);
  }

  remove(id: number) {
    return this.relationshipRepository.delete(id);
  }
}
