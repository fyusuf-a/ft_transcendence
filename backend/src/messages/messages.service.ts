import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  findAll(): Promise<Message[]> {
    return this.messagesRepository.find();
  }

  findOne(id: number): Promise<Message> {
    return this.messagesRepository.findOne(id);
  }

  async create(messageDto: CreateMessageDto): Promise<Message> {
    return await this.messagesRepository.save(messageDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.messagesRepository.delete(id);
  }
}
