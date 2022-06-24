import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsPositive } from 'class-validator';
import { FriendshipTypeEnum } from '../entities/friendship.entity';

export class FriendshipDto {
  @ApiProperty({
    description: 'The id of a Friendship entry',
  })
  @IsInt()
  @IsPositive()
  id: number;

  @ApiProperty({
    description: 'The id of the first user',
  })
  @IsInt()
  @IsPositive()
  sourceId: number;

  @ApiProperty({
    description: 'The id of the second user',
  })
  @IsInt()
  @IsPositive()
  targetId: number;

  @ApiProperty({
    description: 'The status of the friendship',
    type: FriendshipTypeEnum,
    enum: FriendshipTypeEnum,
    enumName: 'FriendshipTypeEnum',
    isArray: false,
    examples: [FriendshipTypeEnum.PENDING, FriendshipTypeEnum.ACCEPTED],
  })
  @IsEnum(FriendshipTypeEnum, { each: true })
  status: FriendshipTypeEnum;
}
