import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findById(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async create(userDto: CreateUserDto): Promise<User> {
    return await this.usersRepository.save(userDto);
  }

  async update(id: string, userDto: UpdateUserDto): Promise<UpdateResult> {
    return await this.usersRepository.update(id, userDto);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
