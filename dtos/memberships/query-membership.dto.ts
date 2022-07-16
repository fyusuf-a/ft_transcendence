import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { MembershipRoleType } from './membership.dto';

export class QueryMembershipDto {
  @ApiPropertyOptional({
    description: 'Role Type',
  })
  @IsOptional()
  @IsEnum(MembershipRoleType)
  role?: MembershipRoleType;

  @ApiPropertyOptional({
    description: 'Channel Id',
  })
  @IsOptional()
  @IsNumberString()
  channel?: string;

  @ApiPropertyOptional({
    description: 'User Id',
  })
  @IsOptional()
  @IsNumberString()
  user?: string;

  @ApiPropertyOptional({
    description: 'Datetime that mute expires',
  })
  @IsOptional()
  @IsDate()
  mutedUntil?: Date;

  @ApiPropertyOptional({
    description: 'Datetime that ban expires',
  })
  @IsOptional()
  @IsDate()
  bannedUntil?: Date;
}
