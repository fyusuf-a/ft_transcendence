import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { ChannelType } from '../entities/channel.entity';

export class ChannelDto {
  @ApiProperty({
    description: 'The id of a channel',
  })
  @IsPositive()
  @IsInt()
  id: number;

  @ApiProperty({
    description: 'The unique channel name',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The channel type',
    type: ChannelType,
    enum: ChannelType,
    enumName: 'ChannelType',
    isArray: false,
    examples: [ChannelType.PUBLIC, ChannelType.PROTECTED, ChannelType.PRIVATE],
  })
  @IsEnum(ChannelType, { each: true })
  type: ChannelType;

  @ApiProperty({
    description: 'A password for a PROTECTED channel',
  })
  @IsOptional()
  @IsNotEmpty()
  password?: string;

  @ApiProperty({
    description: 'First user Id (if this is a direct messages channel).',
  })
  @IsOptional()
  @IsNotEmpty()
  userOneId?: number;

  @ApiProperty({
    description: 'Second user Id (if this is a direct messages channel).',
  })
  @IsOptional()
  @IsNotEmpty()
  userTwoId?: number;
}
