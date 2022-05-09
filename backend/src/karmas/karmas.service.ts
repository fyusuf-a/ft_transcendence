import { Injectable } from '@nestjs/common';
import { CreateKarmaDto } from './dto/create-karma.dto';
import { UpdateKarmaDto } from './dto/update-karma.dto';

@Injectable()
export class KarmasService {
  create(createKarmaDto: CreateKarmaDto) {
    return 'This action adds a new karma';
  }

  findAll() {
    return `This action returns all karmas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} karma`;
  }

  update(id: number, updateKarmaDto: UpdateKarmaDto) {
    return `This action updates a #${id} karma`;
  }

  remove(id: number) {
    return `This action removes a #${id} karma`;
  }
}
