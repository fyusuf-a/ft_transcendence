import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { FriendshipTypeEnum } from '../entities/friendship.entity';

export class QueryFriendshipDto {
  @ApiPropertyOptional({
    description: 'Source User Id',
  })
  @IsOptional()
  @IsNumberString()
  source?: string;

  @ApiPropertyOptional({
    description: 'Target User Id',
  })
  @IsOptional()
  @IsNumberString()
  target?: string;

  @ApiPropertyOptional({
    description: 'Status',
  })
  @IsOptional()
  @IsEnum(FriendshipTypeEnum)
  status?: FriendshipTypeEnum;
}
