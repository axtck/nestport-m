import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigHelper, IAuthConfig } from 'src/config/config.helper';
import { Null } from 'src/types/core.types';
import { ILoginUser } from 'src/users/interfaces/models/auth-user';
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

  public async validateUser(username: string, password: string): Promise<Null<IUserIdentifier>> {
    const user: Null<ILoginUser> = await this.usersService.findOneByUsername(username);
    if (!user) return null; // TODO: throw not found

    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return {
      id: user.id,
      username: user.username,
    };
  }

  public async getAccessToken(user: IUserIdentifier): Promise<string> {
    const token: IJwtTokenSignature = {
      sub: user.id,
      username: user.username,
    };

    const options: JwtSignOptions = {
      expiresIn: this.authConfig.jwtExpiry,
    };

    return this.jwtTokenService.sign(token, options);
  }
}
