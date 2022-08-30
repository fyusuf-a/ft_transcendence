import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QueryUrlDto {
  @ApiProperty({
    description: 'The ID of the 42 API app',
  })
  client_id!: string;

  @ApiProperty({
    description: 'The URL where users will be sent after authorization',
  })
  redirect_uri!: string;

  @ApiPropertyOptional({
    description: 'A space separated list of scopes',
    default: 'public',
  })
  scope?: string;

  @ApiPropertyOptional({
    description:
      'An unguessable random string. It is used to protect against cross-site request forgery attacks',
  })
  state?: string;

  @ApiPropertyOptional({
    description: `The response type. Usually 'code'.`,
    default: 'code',
  })
  response_type?: string;
}
