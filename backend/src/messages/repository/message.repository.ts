import { Message } from '../entities/message.entity';
import { PageDto, PageOptionsDto } from '@dtos/pages';
import { QueryMessageDto } from '@dtos/messages';
import { PaginatedRepository } from '../../common/repository';
import { EntityRepository } from 'typeorm';

@EntityRepository(Message)
export default class MessageRepository extends PaginatedRepository<Message> {
  public async findAllPaginated(
    query?: QueryMessageDto,
    pageOptions?: PageOptionsDto,
  ): Promise<PageDto<Message>> {
    return this.findAllPaginated2(
      pageOptions,
      'message',
      'id',
      (selectQueryBuilder) => {
        if (query.channel) {
          selectQueryBuilder.where('message.channel = :channel', {
            channel: query.channel,
          });
        }
      },
    );
  }
}
