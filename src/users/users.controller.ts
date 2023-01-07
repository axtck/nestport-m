import { Body, Controller, Delete, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/decorators/user.decorator';
import { Id } from 'src/types/core.types';
import { CreateUserDto } from './interfaces/dtos/create-user.dto';
import { IUser } from './interfaces/models/user';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('/')
  public async findAll(): Promise<IUser[]> {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/info')
  public async findOne(@User('id') id: Id): Promise<IUser> {
    return this.userService.findOne(id);
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  public async create(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/')
  public async remove(@User('id') id: Id): Promise<void> {
    await this.userService.remove(id);
  }
}
