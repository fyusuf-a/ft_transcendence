// adapted from https://pietrzakadrian.com/blog/how-to-create-pagination-in-nestjs-with-typeorm-swagger

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Min, Max, IsEnum, IsInt, IsOptional } from 'class-validator';
import { Order } from '../constants';

const itemMaximum = 50;
const orderDefault = Order.ASC;
const pageDefault = 1;
export const takeDefault = 10;

export class PageOptionsDto {
  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: pageDefault,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number = pageDefault;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: itemMaximum,
    default: takeDefault,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(itemMaximum)
  @IsOptional()
  readonly take?: number = takeDefault;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

  constructor(
    page: number = pageDefault,
    take: number = takeDefault,
    order: Order = orderDefault,
  ) {
    this.order = order;
    this.page = page;
    this.take = take;
  }
}
