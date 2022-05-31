import { Message } from '../../messages/entities/message.entity';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { QueryMessageDto } from 'src/messages/dto/query-messages.dto';
import { PageDto } from '../../common/dto/page.dto';
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
