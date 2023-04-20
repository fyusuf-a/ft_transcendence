import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { stringify } from 'querystring';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import axios from 'axios';
import { AxiosResponse } from 'axios';
import { User } from 'src/users/entities/user.entity';

interface MarvinUser {
  login: string;
}

@Injectable()
export class MarvinStrategy extends PassportStrategy(Strategy, 'marvin') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const clientID = configService.get<string>('BACKEND_42_UID');
    const callbackURL = `${configService.get<string>(
      'URL',
    )}/api/auth/callback/marvin`;
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

  async validate(accessToken: string): Promise<User> {
    let response: AxiosResponse<MarvinUser>;
    try {
      response = await axios.get<MarvinUser>('https://api.intra.42.fr/v2/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch {
      throw new UnauthorizedException();
    }
    return this.authService.authStrategy(response.data.login);
  }
}
