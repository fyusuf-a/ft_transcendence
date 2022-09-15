import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './types';

@Injectable()
export class TwoAuthJwtStrategy extends PassportStrategy(Strategy, 'two-auth') {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.usersService.findOne(payload.id);
      if (!user.isTwoFAEnabled) {
        return user;
      }
      if (payload.isTwoFAAuthenticated) {
        return user;
      }
    } catch {
      throw new UnauthorizedException('Invalid Token');
    }
    throw new UnauthorizedException('Invalid Token');
  }
}
