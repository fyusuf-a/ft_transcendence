import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PageDto } from '../common/dto/page.dto';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import UserRepository from './repository/user.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository)
    private usersRepository: UserRepository,
  ) {}

  async findAll(
    query?: QueryUserDto,
    pageOptions: PageOptionsDto = new PageOptionsDto(),
  ): Promise<PageDto<User>> {
    return this.usersRepository.findAllPaginated(query, pageOptions);
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  findByName(username: string): Promise<User> {
    return this.usersRepository.findOneOrFail({
      where: { username: username },
    });
  }

  create(userDto: CreateUserDto): Promise<User> {
    return this.usersRepository.save(userDto);
  }

  update(id: number, userDto: UpdateUserDto): Promise<UpdateResult> {
    return this.usersRepository.update(id, userDto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.usersRepository.delete(id);
  }
}
