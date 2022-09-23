import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Query,
  Post,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { twoFACodeDto } from '@dtos/auth';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Public } from './auth.public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RequestWithUser, JwtToken } from './types';
import { Response } from 'express';
import { ResponseUserDto } from '@dtos/users';
import { IfAuthIsDisabled } from './if-auth-is-disabled.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  private redirect(res: Response, id: number, isTwoFAAuthenticated: boolean) {
    const url = new URL(
      `${this.configService.get<string>('FRONTEND_URL')}/login`,
    );
    const token = this.jwtService.sign({
      id,
      isTwoFAAuthenticated,
    });
    url.search = new URLSearchParams({ id, token } as unknown as Record<
      string,
      string
    >).toString();
    return res.redirect(url.toString());
  }

  @Get('callback')
  @Public()
  @UseGuards(AuthGuard('marvin'))
  marvinCallback(@Req() req: RequestWithUser, @Res() res: Response): void {
    return this.redirect(res, req.user.id, false);
  }

  @ApiExcludeEndpoint(process.env.DISABLE_AUTHENTICATION === 'false')
  @Get('fake-callback')
  @Public()
  @IfAuthIsDisabled()
  async fakeMarvinCallback(
    @Res() res: Response,
    @Query('username') username: string,
  ) {
    let user: ResponseUserDto;
    try {
      user = await this.usersService.findByName(username);
    } catch {
      throw new BadRequestException('User not found');
    }
    this.redirect(res, user.id, true);
  }

  @ApiBearerAuth()
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
  @UseGuards(AuthGuard('jwt'))
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
