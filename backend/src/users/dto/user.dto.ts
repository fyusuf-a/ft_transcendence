import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsPositive, Min } from 'class-validator';

export class UserDto {
  @ApiProperty({
    description: 'The id of a user',
  })
  @IsPositive()
  @IsInt()
  id: number;

  @ApiProperty({
    description:
      'The external identity of a user from a supported OAuth provider',
  })
  @IsNotEmpty()
  identity: string;

  @ApiProperty({
    description: 'A unique username',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'An avatar for the user',
  })
  avatar: Uint8Array;

  @ApiProperty({
    description: 'Number of matches won',
  })
  @Min(0)
  @IsInt()
  wins: number;

  @ApiProperty({
    description: 'Number of matches lost',
  })
  @Min(0)
  @IsInt()
  losses: number;

  @ApiProperty({
    description: "User's ELO rating",
  })
  @Min(0)
  @IsInt()
  rating: number;

  @IsArray()
  @IsInt()
  membershipIds: number[];

  @IsArray()
  @IsInt()
  friendIds: number[];

  @IsArray()
  @IsInt()
  blockedIds: number[];
}
