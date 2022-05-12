import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class QueryUserDto {
  @ApiPropertyOptional({
    description: 'Username',
  })
  @IsOptional()
  @IsNotEmpty()
  username?: string;
}
