import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './auth.public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly configService: ConfigService) {}

  @Get('callback')
  @Public()
  @UseGuards(AuthGuard('marvin'))
  marvinCallback(@Req() req, @Res() res) {
    const url = new URL(
      `${this.configService.get<string>('FRONTEND_URL')}/login`,
    );
    url.search = new URLSearchParams(req.user).toString();
    return res.redirect(url.toString());
  }
}
