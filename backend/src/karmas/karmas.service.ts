import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateKarmaDto } from './dto/create-karma.dto';
import { UpdateKarmaDto } from './dto/update-karma.dto';
import { Karma } from './entities/karma.entity';

@Injectable()
export class KarmasService {
  constructor(
    @InjectRepository(Karma)
    private karmaRepository: Repository<Karma>
  ) {}

  create(createKarmaDto: CreateKarmaDto) {
    return this.karmaRepository.save(createKarmaDto);
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
