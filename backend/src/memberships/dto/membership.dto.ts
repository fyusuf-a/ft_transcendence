import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsPositive } from 'class-validator';
import { MembershipRoleType } from '../entities/membership.entity';

export class MembershipDto {
  @ApiProperty({
    description: 'The id of a Membership entry',
  })
  @IsInt()
  @IsPositive()
  id: number;

  @ApiProperty({
    description: 'The id of the associated channel',
  })
  @IsInt()
  @IsPositive()
  channelId: number;

  @ApiProperty({
    description: 'The id of the associated user',
  })
  @IsInt()
  @IsPositive()
  userId: number;

  @ApiProperty({
    description: 'The role of the associated user in the associated channel',
    type: MembershipRoleType,
    enum: MembershipRoleType,
    enumName: 'MembershipRoleType',
    isArray: false,
    examples: [MembershipRoleType.PARTICIPANT, MembershipRoleType.ADMIN, MembershipRoleType.OWNER],
  })
  @IsEnum(MembershipRoleType, { each: true })
  role: MembershipRoleType;
}
