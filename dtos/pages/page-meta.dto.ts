// adapted from https://pietrzakadrian.com/blog/how-to-create-pagination-in-nestjs-with-typeorm-swagger

import { ApiProperty } from '@nestjs/swagger';
import { PageOptionsDto, takeDefault } from './page-options.dto';

export class PageMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly take: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor(pageOptionsDto: PageOptionsDto, itemCount: number) {
    this.page = pageOptionsDto?.page ? pageOptionsDto.page : 1;
    this.take = pageOptionsDto?.take ? pageOptionsDto.take : takeDefault;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
