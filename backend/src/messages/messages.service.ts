import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto } from '../common/dto/page.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { DeleteResult } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { QueryMessageDto } from './dto/query-messages.dto';
import { ResponseMessageDto } from './dto/response-message.dto';
import { Message } from './entities/message.entity';
import UserRepository from 'src/users/repository/user.repository';
import ChannelRepository from 'src/channels/repository/channel.repository';
import MessageRepository from 'src/messages/repository/message.repository';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageRepository)
    private messagesRepository: MessageRepository,
    @InjectRepository(UserRepository)
    private usersRepository: UserRepository,
    @InjectRepository(ChannelRepository)
    private channelsRepository: ChannelRepository,
  ) {}

  async findAll(
    query?: QueryMessageDto,
    pageOptions?: PageOptionsDto,
  ): Promise<PageDto<ResponseMessageDto>> {
    return this.messagesRepository.findAllPaginated(query, pageOptions);
  }

  findOne(id: number): Promise<Message> {
    return this.messagesRepository.findOne(id);
  }

  async create(messageDto: CreateMessageDto): Promise<Message> {
    const message: Message = new Message();
    message.content = messageDto.content;
    message.channelId = messageDto.channelId;
    message.channel = await this.channelsRepository.findOne(message.channelId);
    if (
      message.channel === undefined ||
      message.channel.id !== message.channelId
    ) {
      throw new EntityDoesNotExistError(`Channel #${messageDto.channelId}`);
    }
    message.senderId = messageDto.senderId;
    message.sender = await this.usersRepository.findOne(message.senderId);
    if (
      message.sender === undefined ||
      message.sender.id !== message.senderId
    ) {
      throw new EntityDoesNotExistError(`User #${messageDto.senderId}`);
    }
    return await this.messagesRepository.save(message);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.messagesRepository.delete(id);
  }
}
