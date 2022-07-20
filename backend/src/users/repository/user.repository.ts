import { User } from '../entities/user.entity';
import { PageOptionsDto, PageDto } from '@dtos/pages';
import { QueryUserDto } from '@dtos/users';
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
