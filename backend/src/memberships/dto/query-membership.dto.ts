import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { MembershipRoleType } from '../entities/membership.entity';

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
}
