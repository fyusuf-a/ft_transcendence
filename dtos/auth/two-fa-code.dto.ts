import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class twoFACodeDto {
  @ApiProperty({
    description: 'The code from Google Authenticator',
  })
  @IsNotEmpty()
  twoFACode!: string;
}
