import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/channels/entities/channel.entity';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateKarmaDto } from './dto/create-karma.dto';
import { UpdateKarmaDto } from './dto/update-karma.dto';
import { Karma } from './entities/karma.entity';

@Injectable()
export class KarmasService {
  constructor(
    @InjectRepository(Karma)
    private karmaRepository: Repository<Karma>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
  ) {}

  async create(dto: CreateKarmaDto) {
    const karma: Karma = new Karma();
    karma.channelId = dto.channelId;
    karma.channel = await this.channelsRepository.findOne(karma.channelId);
    if (karma.channel === undefined || karma.channel.id !== dto.channelId) {
      throw new EntityDoesNotExistError(`Channel #${dto.channelId}`);
    }
    karma.userId = dto.userId;
    karma.user = await this.usersRepository.findOne(karma.userId);
    if (karma.user === undefined || karma.user.id !== dto.userId) {
      throw new EntityDoesNotExistError(`User #${dto.userId}`);
    }
    karma.start = dto.start;
    karma.end = dto.end;
    karma.type = dto.type;
    return this.karmaRepository.save(karma);
  }

  findAll() {
    return this.karmaRepository.find();
  }

  findOne(id: number) {
    return this.karmaRepository.findOne(id);
  }

  update(id: number, updateKarmaDto: UpdateKarmaDto) {
    return this.karmaRepository.update(id, updateKarmaDto);
  }

  remove(id: number) {
    return this.karmaRepository.delete(id);
  }
}
