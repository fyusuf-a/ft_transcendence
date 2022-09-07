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
  @ApiProperty({
    description:
      'The id of the owner of the channel or the creator of the channel in the case of a direct channel',
  })
  @IsNotEmpty()
  userId!: string;
}
