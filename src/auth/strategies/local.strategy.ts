import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Null } from 'src/types/core.types';
import { AuthService } from '../auth.service';
import { IUserIdentifier } from '../interfaces/user-identifier.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'identifier' }); // modify expected body property
  }

  public async validate(identifier: string, password: string): Promise<IUserIdentifier> {
    const user: Null<IUserIdentifier> = await this.authService.validateUser(identifier, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
