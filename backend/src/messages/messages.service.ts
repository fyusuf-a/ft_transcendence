import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageOptionsDto } from '@dtos/pages';
import {
  CreateMessageDto,
  QueryMessageDto,
  ResponseMessageDto,
} from '@dtos/messages';
import { DeleteResult, FindOptionsWhere, Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import { Channel } from 'src/channels/entities/channel.entity';
import { paginate } from 'src/common/paginate';
import { Membership } from 'src/memberships/entities/membership.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
    @InjectRepository(Membership)
    private membershipsRepository: Repository<Membership>,
  ) {}

  async findAll(
    query?: QueryMessageDto,
    pageOptions: PageOptionsDto = new PageOptionsDto(),
  ): Promise<PageDto<ResponseMessageDto>> {
    const orderOptions = { id: pageOptions.order };
    const findOptionsWhere: FindOptionsWhere<Message> = {
      channel: query?.channel ? { id: +query.channel } : {},
      sender: query?.sender ? { id: +query.sender } : {},
    };
    return paginate(
      this.messagesRepository,
      findOptionsWhere,
      orderOptions,
      pageOptions,
    );
  }

  findOne(id: number): Promise<Message> {
    return this.messagesRepository.findOneByOrFail({ id: id });
  }

  async create(messageDto: CreateMessageDto): Promise<Message> {
    const message: Message = new Message();
    message.content = messageDto.content;
    message.channelId = messageDto.channelId;
    message.channel = await this.channelsRepository.findOneByOrFail({
      id: message.channelId,
    });
    message.senderId = messageDto.senderId;
    message.sender = await this.usersRepository.findOneByOrFail({
      id: message.senderId,
    });

    await this.membershipsRepository.findOneByOrFail({
      userId: message.senderId,
      channelId: message.channelId,
    });

    return await this.messagesRepository.save(message);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.messagesRepository.delete(id);
  }
}
