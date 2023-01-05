import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigHelper, IAuthConfig } from 'src/config/config.helper';
import { IJwtTokenSignature } from '../interfaces/jwt-token-signature.interface';
import { IUserIdentifier } from '../interfaces/user-identifier.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configHelper: ConfigHelper) {
    const authConfig: IAuthConfig = configHelper.getAuthConfig();
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authConfig.jwtSecret,
      ignoreExpiration: false,
    });
  }

  public validate(payload: IJwtTokenSignature): IUserIdentifier {
    return {
      id: payload.sub,
      username: payload.username,
    };
  }
}
