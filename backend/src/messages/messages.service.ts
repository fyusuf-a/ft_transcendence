import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageOptionsDto } from '@dtos/pages';
import {
  CreateMessageDto,
  QueryMessageDto,
  ResponseMessageDto,
} from '@dtos/messages';
import { DeleteResult, FindOptionsWhere, In, Not, Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import { Channel, ChannelType } from 'src/channels/entities/channel.entity';
import { paginate } from 'src/common/paginate';
import { Membership } from 'src/memberships/entities/membership.entity';
import { UsersService } from 'src/users/users.service';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

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
    @Inject(UsersService)
    private readonly usersService: UsersService,
    private readonly notificationsGateway: NotificationsGateway,
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

  async findAllWithBlocks(
    query?: QueryMessageDto,
    pageOptions: PageOptionsDto = new PageOptionsDto(),
  ): Promise<PageDto<ResponseMessageDto>> {
    const blocks =
      query && query.userId
        ? (await this.usersService.findBlocks(+query.userId)).map(
            (block) =>
              (block.sourceId = +query.userId
                ? block.targetId
                : block.sourceId),
          )
        : [];
    const orderOptions = { id: pageOptions.order };
    const findOptionsWhere: FindOptionsWhere<Message> = {
      channel: query?.channel ? { id: +query.channel } : {},
      sender: query?.userId ? { id: Not(In(blocks)) } : {},
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
    const membership: Membership =
      await this.membershipsRepository.findOneByOrFail({
        userId: message.senderId,
        channelId: message.channelId,
      });

    if (message.channel.type == ChannelType.DIRECT) {
      const recipientId: number =
        message.sender.id == message.channel.userOneId
          ? message.channel.userTwoId
          : message.channel.userOneId;
      this.notificationsGateway.handleNewMessage(
        message.sender,
        0,
        recipientId,
        true,
      );
    } else {
      this.notificationsGateway.handleNewMessage(
        message.sender,
        message.channelId,
        message.channelId,
        false,
      );
    }

    const now: Date = new Date();
    if (
      (membership.bannedUntil != null && membership.bannedUntil > now) ||
      (membership.mutedUntil != null && membership.mutedUntil > now)
    ) {
      throw 'Unauthorized';
    }
    return await this.messagesRepository.save(message);
  }

  async remove(id: number): Promise<DeleteResult> {
    return await this.messagesRepository.delete(id);
  }
}
