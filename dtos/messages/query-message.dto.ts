import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class QueryMessageDto {
  @ApiProperty({
    description: 'Channel Id',
  })
  @IsNumberString()
  channel!: string;

  @ApiPropertyOptional({
    description: 'Sender Id',
  })
  @IsOptional()
  @IsNumberString()
  sender?: string;

  @ApiPropertyOptional({
    description: 'Id of the user asking for the messages',
  })
  @IsOptional()
  userId?: string;
}
