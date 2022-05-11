import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from 'src/channels/entities/channel.entity';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { User } from 'src/users/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
  ) {}

  findAll(): Promise<Message[]> {
    return this.messagesRepository.find();
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
