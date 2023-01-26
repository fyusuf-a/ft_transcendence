import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Query,
  Post,
  UseGuards,
  HttpStatus,
  Redirect,
} from '@nestjs/common';
import { twoFACodeDto } from '@dtos/auth';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Public } from './auth.public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtToken } from './types';
import { IfAuthIsDisabled } from './if-auth-is-disabled.decorator';
import { User } from '../users/entities/user.entity';
import { AuthUser } from './auth-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  private getToken(id: number, isTwoFAAuthenticated: boolean): JwtToken {
    return this.jwtService.sign({
      id,
      isTwoFAAuthenticated,
    });
  }

  private redirect(id: number, isTwoFAAuthenticated: boolean) {
    const url = new URL(`http://${process.env.DOMAIN}/login`);
    const token = this.getToken(id, isTwoFAAuthenticated);
    url.search = new URLSearchParams({ id, token } as unknown as Record<
      string,
      string
    >).toString();
    return { statusCode: HttpStatus.FOUND, url: url.toString() };
  }

  @Redirect()
  @Get('callback')
  @Public()
  @UseGuards(AuthGuard('marvin'))
  marvinCallback(@AuthUser() user: User) {
    return this.redirect(user.id, false);
  }

  @Redirect()
  @ApiExcludeEndpoint(process.env.DISABLE_AUTHENTICATION === 'false')
  @Get('fake-callback')
  @Public()
  @IfAuthIsDisabled()
  async fakeMarvinCallback(@Query('username') username: string) {
    const user = await this.usersService.findByName(username);
    return this.redirect(user.id, true);
  }

  @ApiExcludeEndpoint(process.env.DISABLE_AUTHENTICATION === 'false')
  @Get('fake-token')
  @Public()
  @IfAuthIsDisabled()
  async fakeToken(@Query('username') username: string) {
    const user = await this.usersService.findByName(username);
    return this.getToken(user.id, true);
  }

  @ApiBearerAuth()
  @Post('2fa/generate')
  async generate(@AuthUser() user: User) {
    if (user.isTwoFAEnabled) {
      throw new BadRequestException(
        'Two factor authentication already enabled',
      );
    }
    return await this.authService.generateTwoFASecret(user.id);
  }

  @ApiBearerAuth()
  @Public()
  @UseGuards(AuthGuard('jwt'))
  @Post('2fa/authenticate')
  async authenticate(
    @AuthUser() user: User,
    @Body() body: twoFACodeDto,
  ): Promise<JwtToken> {
    const isCodeValid =
      await this.authService.verifyTwoFactorAuthenticationCode(
        body.twoFACode,
        user.id,
      );
    if (!isCodeValid) {
      throw new BadRequestException('Invalid two factor authentication code');
    }
    await this.usersService.setTwoFA(true, user.id);
    return this.jwtService.sign({
      id: user.id,
      isTwoFAAuthenticated: true,
    });
  }

  @ApiBearerAuth()
  @Get('2fa/deactivate')
  async deactivate(@AuthUser() user: User) {
    await this.usersService.setTwoFA(false, user.id);
  }
}
