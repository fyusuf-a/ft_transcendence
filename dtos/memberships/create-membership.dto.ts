import { PickType } from '@nestjs/mapped-types';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { MembershipDto } from './membership.dto';

export class CreateMembershipDto extends PickType(MembershipDto, [
  'channelId',
  'userId',
  'role',
]) {
  @IsOptional()
  @IsDate()
  mutedUntil?: Date;

  @IsOptional()
  @IsDate()
  bannedUntil?: Date;

  @IsOptional()
  @IsString()
  password?: string;
}
