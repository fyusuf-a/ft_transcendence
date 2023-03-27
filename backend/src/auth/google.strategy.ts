import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { stringify } from 'querystring';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import axios from 'axios';
import { AxiosResponse } from 'axios';
import { CreateUserDto, UserDto } from '@dtos/users';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';

interface MarvinUser {
  login: string;
}

@Injectable()
export class MarvinStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {
    const clientID = configService.get<string>('BACKEND_42_UID');
    const callbackURL = `${configService.get<string>('URL')}/api/auth/callback`;
    super({
      authorizationURL: `https://api.intra.42.fr/oauth/authorize?${stringify({
        client_id: clientID,
        redirect_uri: callbackURL,
        scope: 'public',
        response_type: 'code',
      })}`,
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      scope: 'public',
      clientID,
      clientSecret: configService.get<string>('BACKEND_42_SECRET'),
      callbackURL,
    });
  }

  async validate(accessToken: string): Promise<UserDto> {
    let response: AxiosResponse<MarvinUser>;
    try {
      response = await axios.get<MarvinUser>('https://api.intra.42.fr/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch {
      throw new UnauthorizedException();
    }
    let user: User;
    try {
      user = await this.userService.findByMarvinId(response.data.login);
    } catch {
      const createUserDto = new CreateUserDto();
      createUserDto.identity = response.data.login;
      createUserDto.username = response.data.login;
      try {
        user = await this.userService.create(createUserDto);
      } catch {
        throw new UnauthorizedException();
      }
    }
    return user;
  }
}
