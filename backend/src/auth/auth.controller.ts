import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { twoFACodeDto } from '@dtos/auth';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from './auth.public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/auth.jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RequestWithUser, JwtToken } from './types';
import { ResponseUserDto } from '@dtos/users';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get('callback')
  @Public()
  @UseGuards(AuthGuard('marvin'))
  marvinCallback(@Req() req: RequestWithUser, @Res() res) {
    const url = new URL(
      `${this.configService.get<string>('FRONTEND_URL')}/login`,
    );
    const token = this.jwtService.sign({
      id: req.user.id,
      isTwoFAAuthenticated: false,
    });
    url.search = new URLSearchParams({
      id: req.user.id,
      token: token,
    } as unknown as Record<string, string>).toString();
    return res.redirect(url.toString());
  }

  @ApiBearerAuth()
  @Public()
  @UseGuards(JwtAuthGuard)
  @Post('2fa/generate')
  async generate(@Req() req: RequestWithUser) {
    const user: ResponseUserDto = await this.usersService.findOne(req.user.id);
    if (user.isTwoFAEnabled) {
      throw new BadRequestException(
        'Two factor authentication already enabled',
      );
    }
    return await this.authService.generateTwoFASecret(req.user.id);
  }

  @ApiBearerAuth()
  @Public()
  @UseGuards(JwtAuthGuard)
  @Post('2fa/authenticate')
  async authenticate(
    @Req() req: RequestWithUser,
    @Body() body: twoFACodeDto,
  ): Promise<JwtToken> {
    const isCodeValid =
      await this.authService.verifyTwoFactorAuthenticationCode(
        body.twoFACode,
        req.user.id,
      );
    if (!isCodeValid) {
      throw new BadRequestException('Invalid two factor authentication code');
    }
    await this.usersService.setTwoFA(true, req.user.id);
    return this.jwtService.sign({
      id: req.user.id,
      isTwoFAAuthenticated: true,
    });
  }

  @ApiBearerAuth()
  @Get('2fa/deactivate')
  async deactivate(@Req() req: RequestWithUser) {
    await this.usersService.setTwoFA(false, req.user.id);
  }
}
