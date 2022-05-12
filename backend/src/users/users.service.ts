import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(query?: QueryUserDto): Promise<User[]> {
    return this.usersRepository.find({ where: query });
  }

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
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
