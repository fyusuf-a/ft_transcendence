import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { authenticator } from 'otplib';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async findUserFromMarvinId(marvinId: string): Promise<any> {
    try {
      return await this.usersService.findByMarvinId(marvinId);
    } catch {
      throw new UnauthorizedException();
    }
  }

  async generateTwoFASecret(userId: number): Promise<string> {
    const secret = authenticator.generateSecret();
    const otpAuthUrl = authenticator.keyuri(
      userId.toString(),
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      secret,
    );
    await this.usersService.setTwoFASecret(secret, userId);
    return otpAuthUrl;
  }

  async verifyTwoFactorAuthenticationCode(
    twoFACode: string,
    id: number,
  ): Promise<boolean> {
    const user = await this.usersService.findOne(id);
    return authenticator.verify({
      token: twoFACode,
      secret: user.twoFASecret,
    });
  }
}
