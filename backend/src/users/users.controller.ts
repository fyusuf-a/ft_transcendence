import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseUserDto } from './dto/responseUser.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UpdateResult } from 'typeorm';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<ResponseUserDto[]> {
    return await this.usersService.findAll();
  }

  @Post('create')
  @ApiResponse({ status: 500, description: 'Record could not be created.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    return await this.usersService.create(createUserDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Get(':id')
  @ApiResponse({ status: 404, description: 'Record not found.' })
  async findById(@Param('id') id: string): Promise<ResponseUserDto> {
    const user: ResponseUserDto = await this.usersService.findById(id);
    if (user === undefined) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Delete(':id')
  async removeById(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
