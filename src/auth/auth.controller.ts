import { Controller, Post, UseGuards } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import { Id } from 'src/types/core.types';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { IUserIdentifier } from './interfaces/user-identifier.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@User() user: IUserIdentifier): Promise<{ userId: Id; token: string }> {
    return this.service.getAccessToken(user);
  }
}
