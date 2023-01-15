import { Body, Controller, Get, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/decorators/user.decorator';
import { Id } from 'src/types/core.types';
import { UpdateProfileDto } from './interfaces/dtos/update-profile.dto';
import { IProfile } from './interfaces/models/profile';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly service: ProfilesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/info')
  public async findOne(@User('id') id: Id): Promise<IProfile> {
    return this.service.findOneByUserId(id);
  }

  @Put('/')
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  public async create(@User('id') userId: Id, @Body() createUserDto: UpdateProfileDto): Promise<void> {
    await this.service.upsert(userId, createUserDto);
  }
}
