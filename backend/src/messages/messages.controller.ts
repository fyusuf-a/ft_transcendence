import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
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
import { PageDto, PageOptionsDto } from '@dtos/pages';
import {
  CreateMessageDto,
  QueryMessageDto,
  ResponseMessageDto,
} from '@dtos/messages';
import { DeleteResult, EntityNotFoundError } from 'typeorm';
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
  async create(
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<ResponseMessageDto> {
    return await this.messagesService.create(createMessageDto);
  }

  @Get(':id')
  @ApiResponse({ status: 404, description: 'Record not found.' })
  async findOne(@Param('id') id: string): Promise<ResponseMessageDto> {
    try {
      return await this.messagesService.findOne(+id);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException('Not Found');
      }
    }
  }

  @Delete(':id')
  removeById(@Param('id') id: string): Promise<DeleteResult> {
    return this.messagesService.remove(+id);
  }
}
