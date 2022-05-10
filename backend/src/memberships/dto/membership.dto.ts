import { ApiProperty } from '@nestjs/swagger';
import { MembershipRoleType } from '../entities/membership.entity';

export class MembershipDto {
  @ApiProperty({
    description: 'The id of a Membership entry',
  })
  id: number;

  @ApiProperty({
    description: 'The id of the associated channel',
  })
  channelId: number;

  @ApiProperty({
    description: 'The id of the associated user',
  })
  userId: number;

  @ApiProperty({
    description: 'The role of the associated user in the associated channel',
  })
  role: MembershipRoleType;
}
