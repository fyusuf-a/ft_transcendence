import {
  BadRequestException,
  UnauthorizedException,
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
import { JwtTwoAuthGuard } from 'src/auth/auth.jwt-twoauth.guard';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UserDto } from '@dtos/users';

interface RequestWithUser {
  user: UserDto;
}

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
  marvinCallback(@Req() req, @Res() res) {
    const url = new URL(
      `${this.configService.get<string>('FRONTEND_URL')}/login`,
    );
    url.search = new URLSearchParams(req.user).toString();
    return res.redirect(url.toString());
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('2fa/generate')
  async generate(@Req() req, @Res() res) {
    if (!req.user?.id) {
      throw new BadRequestException('Invalid token');
    }
    res.set({ 'Content-Type': 'image/png' });
    const { otpAuthUrl } = await this.authService.generateTwoFASecret(
      req.user.id,
    );
    return this.authService.pipeQrCodeStream(res, otpAuthUrl);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('2fa/turnon')
  async turnOnTwoFactorAuthentication(@Req() req, @Body() body: twoFACodeDto) {
    const isCodeValid =
      await this.authService.verifyTwoFactorAuthenticationCode(
        body.twoFACode,
        req.user,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid two factor authentication code');
    }
    await this.usersService.setTwoFA(true, req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('2fa/authenticate')
  async authenticate(@Req() req, @Body() body: twoFACodeDto) {
    const isCodeValid = this.authService.verifyTwoFactorAuthenticationCode(
      body.twoFACode,
      req.user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid two factor authentication code');
    }
    return {
      id: req.user.id,
      token: this.jwtService.sign({
        id: req.user.id,
        isTwoFAAuthenticated: true,
      }),
    };
  }
}
