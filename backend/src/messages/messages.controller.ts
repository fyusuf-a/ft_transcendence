import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
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
    if (query && query.sender)
      return this.messagesService.findAll(query, pageOptions);
    else return this.messagesService.findAllWithBlocks(query, pageOptions);
  }

  @Post()
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Record could not be created.' })
  async create(
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<ResponseMessageDto> {
    try {
      const ret = await this.messagesService.create(createMessageDto);
      return ret;
    } catch (err) {
      if (err == 'Unauthorized') {
        throw new HttpException(
          'You are banned or muted on this channel.',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
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
