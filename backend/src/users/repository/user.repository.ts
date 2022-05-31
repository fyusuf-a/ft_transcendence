import { User } from '../../users/entities/user.entity';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { QueryUserDto } from '../dto/query-user.dto';
import { PageDto } from '../../common/dto/page.dto';
import { PaginatedRepository } from '../../common/repository';
import { EntityRepository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
@EntityRepository(User)
export default class UserRepository extends PaginatedRepository<User> {
  public async findAllPaginated(
    query?: QueryUserDto,
    pageOptions?: PageOptionsDto,
  ): Promise<PageDto<User>> {
    return this.findAllPaginated2(
      pageOptions,
      'user',
      'id',
      (selectQueryBuilder) => {
        if (query?.username) {
          selectQueryBuilder.where('user.username = :username', {
            username: query.username,
          });
        }
      },
    );
  }
}
