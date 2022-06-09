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
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PageDto } from '../common/dto/page.dto';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { DeleteResult } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { QueryMessageDto } from './dto/query-messages.dto';
import { ResponseMessageDto } from './dto/response-message.dto';
import { MessagesService } from './messages.service';

@ApiBearerAuth()
@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async findAll(
    @Query() query?: QueryMessageDto,
    @Query() pageOptions?: PageOptionsDto,
  ): Promise<PageDto<ResponseMessageDto>> {
    return this.messagesService.findAll(query, pageOptions);
  }

  @Post()
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Record could not be created.' })
  create(
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<ResponseMessageDto> {
    try {
      return this.messagesService.create(createMessageDto);
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
