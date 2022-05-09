import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/createMessage.dto';
import { Message } from './message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  findAll(): Promise<Message[]> {
    return this.messagesRepository.find();
  }

  findById(id: string): Promise<Message> {
    return this.messagesRepository.findOne(id);
  }

  async create(messageDto: CreateMessageDto): Promise<Message> {
    return await this.messagesRepository.save(messageDto);
  }

  async remove(id: string): Promise<void> {
    await this.messagesRepository.delete(id);
  }
}
