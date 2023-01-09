import { Body, Controller, Delete, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { User } from 'src/decorators/user.decorator';
import { Id } from 'src/types/core.types';
import { CreateUserDto } from './interfaces/dtos/create-user.dto';
import { IUser } from './interfaces/models/user';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService, private readonly eventEmitter: EventEmitter2) {}

  @Get('/')
  public async findAll(): Promise<IUser[]> {
    return this.service.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/info')
  public async findOne(@User('id') id: Id): Promise<IUser> {
    return this.service.findOne(id);
  }

  @Post('/')
  @UsePipes(ValidationPipe)
  public async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    const createdUser: IUser = await this.service.create(createUserDto);
    this.eventEmitter.emit('user.created', createdUser);
    return createdUser;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/')
  public async remove(@User('id') id: Id): Promise<void> {
    await this.service.remove(id);
  }
}
