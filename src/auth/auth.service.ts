import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigHelper, IAuthConfig } from 'src/config/config.helper';
import { Null } from 'src/types/core.types';
import { ILoginUser } from 'src/users/interfaces/models/auth-user';
import { emailRegex } from 'src/utils/pattern-utils';
import { UsersService } from '../users/users.service';
import { IJwtTokenSignature } from './interfaces/jwt-token-signature.interface';
import { IUserIdentifier } from './interfaces/user-identifier.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtTokenService: JwtService,
    private readonly configHelper: ConfigHelper,
  ) {}

  private readonly authConfig: IAuthConfig = this.configHelper.getAuthConfig();

  public async validateUser(identifier: string, password: string): Promise<Null<IUserIdentifier>> {
    const user: Null<ILoginUser> = emailRegex.test(identifier)
      ? await this.usersService.findOneByEmail(identifier)
      : await this.usersService.findOneByUsername(identifier);
    if (!user) return null;

    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return {
      id: user.id,
      identifier: identifier,
    };
  }

  public async getAccessToken(user: IUserIdentifier): Promise<string> {
    console.log(user);
    const token: IJwtTokenSignature = {
      sub: user.id,
      identifier: user.identifier,
    };

    const options: JwtSignOptions = {
      expiresIn: this.authConfig.jwtExpiry,
    };

    return this.jwtTokenService.sign(token, options);
  }
}
