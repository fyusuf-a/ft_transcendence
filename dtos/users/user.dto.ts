import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty, IsPositive, Min } from 'class-validator';

export class UserDto {
  @ApiProperty({
    description: 'The id of a user',
  })
  @IsPositive()
  @IsInt()
  id!: number;

  @ApiProperty({
    description:
      'The external identity of a user from a supported OAuth provider',
  })
  @IsNotEmpty()
  identity!: string;

  @ApiProperty({
    description: 'A unique username',
  })
  @IsNotEmpty()
  username!: string;

  @ApiProperty({
    description: 'An avatar for the user',
  })
  avatar!: string;

  @ApiProperty({
    description: 'Number of matches won',
  })
  @Min(0)
  @IsInt()
  wins!: number;

  @ApiProperty({
    description: 'Number of matches lost',
  })
  @Min(0)
  @IsInt()
  losses!: number;

  @ApiProperty({
    description: "User's ELO rating",
  })
  @Min(0)
  @IsInt()
  rating!: number;

  @IsArray()
  @IsInt()
  membershipIds!: number[];

  @ApiProperty({
    description: 'Whether the user has activated the two-factor authentication',
  })
  @IsNotEmpty()
  isTwoFAEnabled!: boolean;

  @ApiProperty({
    description: 'The secret for the two-factor authentication',
  })
  @IsNotEmpty()
  twoFASecret!: string;
}
