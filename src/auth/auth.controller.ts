import { Controller, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { IUserIdentifier } from './interfaces/user-identifier.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@User() user: IUserIdentifier): Promise<string> {
    const accessToken: string = await this.authService.getAccessToken(user);
    return accessToken;
  }
}
