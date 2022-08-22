import { PickType } from '@nestjs/mapped-types';
import { ChannelDto } from './channel.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateChannelDto extends PickType(ChannelDto, [
  'name',
  'type',
  'password',
  'userOneId',
  'userTwoId',
]) {
  @ApiProperty()
  @IsNotEmpty()
  userId!: string;
}
