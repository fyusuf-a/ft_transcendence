import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { ChannelType } from '../entities/channel.entity';

export class QueryChannelDto {
  @ApiPropertyOptional({
    description: 'Channel Name',
  })
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({
    description: 'Channel Type',
  })
  @IsOptional()
  @IsEnum(ChannelType)
  type?: ChannelType;
}
