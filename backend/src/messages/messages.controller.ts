import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { DeleteResult } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { ResponseMessageDto } from './dto/response-message.dto';
import { MessagesService } from './messages.service';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  findAll(): Promise<ResponseMessageDto[]> {
    return this.messagesService.findAll();
  }

  @Post()
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Record could not be created.' })
  create(@Body() createUserDto: CreateMessageDto): Promise<ResponseMessageDto> {
    try {
      return this.messagesService.create(createUserDto);
    } catch (error) {
      if (error instanceof EntityDoesNotExistError) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }

  @Get(':id')
  @ApiResponse({ status: 404, description: 'Record not found.' })
  async findOne(@Param('id') id: string): Promise<ResponseMessageDto> {
    const user: ResponseMessageDto = await this.messagesService.findOne(+id);
    if (user === undefined) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Delete(':id')
  removeById(@Param('id') id: string): Promise<DeleteResult> {
    return this.messagesService.remove(+id);
  }
}
