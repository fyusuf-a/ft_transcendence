import { PickType } from '@nestjs/swagger';
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
