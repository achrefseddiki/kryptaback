import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { AuthService } from '../auth.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: config.get<string>('FACEBOOK_APP_ID')!,
      clientSecret: config.get<string>('FACEBOOK_APP_SECRET')!,
      callbackURL: config.get<string>('FACEBOOK_CALLBACK_URL')!,
      scope: ['email'],
      profileFields: ['id', 'emails', 'name'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (err: any, user?: any) => void,
  ) {
    const { id, emails, name } = profile;
    const token = await this.authService.validateOAuthUser({
      provider: 'facebook',
      providerId: id,
      email: emails?.[0]?.value ?? `fb_${id}@noemail.local`,
      firstName: name?.givenName ?? '',
      lastName: name?.familyName ?? '',
    });
    done(null, { token });
  }
}
