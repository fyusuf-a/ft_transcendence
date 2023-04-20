import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-oauth2';
import { stringify } from 'querystring';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import axios from 'axios';
import { AxiosResponse } from 'axios';
import { User } from 'src/users/entities/user.entity';

interface GoogleUser {
  email: string;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    const clientID = configService.get<string>('BACKEND_GOOGLE_UID');
    const callbackURL = `${configService.get<string>(
      'URL',
    )}/api/auth/callback/google`;
    super({
      authorizationURL: `https://accounts.google.com/o/oauth2/v2/auth?${stringify(
        {
          client_id: clientID,
          redirect_uri: callbackURL,
          scope: 'email',
          response_type: 'code',
        },
      )}`,
      tokenURL: 'https://oauth2.googleapis.com/token',
      scope: 'https://www.googleapis.com/auth/userinfo.email',
      clientID,
      clientSecret: configService.get<string>('BACKEND_GOOGLE_SECRET'),
      callbackURL,
    });
  }

  async validate(accessToken: string): Promise<User> {
    let response: AxiosResponse<GoogleUser>;
    try {
      response = await axios.get<GoogleUser>(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
    } catch (e) {
      throw new UnauthorizedException();
    }
    return this.authService.authStrategy(response.data.email);
  }
}
