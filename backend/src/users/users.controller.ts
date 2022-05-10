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
import { ResponseUserDto } from './dto/response-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<ResponseUserDto[]> {
    return await this.usersService.findAll();
  }

  @Post()
  @ApiResponse({ status: 500, description: 'Record could not be created.' })
  create(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Get(':id')
  @ApiResponse({ status: 404, description: 'Record not found.' })
  async findOne(@Param('id') id: string): Promise<ResponseUserDto> {
    const user: ResponseUserDto = await this.usersService.findOne(+id);
    if (user === undefined) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Delete(':id')
  removeById(@Param('id') id: string): Promise<DeleteResult> {
    return this.usersService.remove(+id);
  }
}
