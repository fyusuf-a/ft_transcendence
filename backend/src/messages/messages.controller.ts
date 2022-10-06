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
  ForbiddenException,
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
import { DeleteResult } from 'typeorm';
import { MessagesService } from './messages.service';
import { AuthUser, User } from 'src/auth/auth-user.decorator';
import { MembershipsService } from 'src/memberships/memberships.service';

@ApiBearerAuth()
@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly membershipsService: MembershipsService,
  ) {}

  @Get()
  async findAll(
    @AuthUser() user: User,
    @Query() query: QueryMessageDto,
    @Query() pageOptions?: PageOptionsDto,
  ): Promise<PageDto<ResponseMessageDto>> {
    await this.membershipsService.isUserCapableInChannel(user, query.channel, {
      banned: false,
      muted: undefined,
    });
    if (query && query.sender)
      return this.messagesService.findAll(query, pageOptions);
    else return this.messagesService.findAllWithBlocks(query, pageOptions);
  }

  // TODO: remove senderId from CreateMessageDto
  @Post()
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiResponse({ status: 500, description: 'Record could not be created.' })
  async create(
    @AuthUser() user: User,
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<ResponseMessageDto> {
    if (user.id !== createMessageDto.senderId) throw new ForbiddenException();
    await this.membershipsService.isUserCapableInChannel(
      user,
      createMessageDto.channelId.toString(),
      {
        banned: false,
        muted: false,
      },
    );
    return await this.messagesService.create(createMessageDto);
  }

  @Get(':id')
  @ApiResponse({ status: 404, description: 'Record not found.' })
  async findOne(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<ResponseMessageDto> {
    const message = await this.messagesService.findOne(+id);
    await this.membershipsService.isUserCapableInChannel(
      user,
      message.channelId.toString(),
      {
        banned: false,
        muted: undefined,
      },
    );
    return message;
  }

  @Delete(':id')
  async removeById(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<DeleteResult> {
    const message = await this.messagesService.findOne(+id);
    if (user.id !== message.senderId) throw new ForbiddenException();
    await this.membershipsService.isUserCapableInChannel(
      user,
      message.channelId.toString(),
      {
        banned: false,
        muted: undefined,
      },
    );
    return this.messagesService.remove(+id);
  }
}
