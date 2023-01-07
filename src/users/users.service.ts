import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Id, Null } from 'src/types/core.types';
import { CreateUserDto } from './interfaces/dtos/create-user.dto';
import { ILoginUser } from './interfaces/models/auth-user';
import { IUser } from './interfaces/models/user';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';
import { ConfigHelper, IAuthConfig } from 'src/config/config.helper';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository, private readonly configHelper: ConfigHelper) {}

  private readonly authConfig: IAuthConfig = this.configHelper.getAuthConfig();

  public async findAll(): Promise<IUser[]> {
    return this.usersRepository.findAll();
  }

  public async findOne(userId: Id): Promise<IUser> {
    const data: Null<IUser> = await this.usersRepository.findOne(userId);
    if (!data) throw new Error('User not found');
    return data;
  }

  public async findOneByUsername(username: string): Promise<Null<ILoginUser>> {
    return this.usersRepository.findOneByKey('username', username);
  }

  public async create(createUserDto: CreateUserDto): Promise<void> {
    await this.ensureUnique(createUserDto.email, createUserDto.username);

    const hashedPassword: string = await bcrypt.hash(createUserDto.password, this.authConfig.saltRounds);

    const userWithHashedPassword: CreateUserDto = {
      ...createUserDto,
      password: hashedPassword,
    };

    await this.usersRepository.create(userWithHashedPassword);
  }

  public async remove(userId: Id): Promise<void> {
    await this.usersRepository.remove(userId);
  }

  private async ensureUnique(email: string, username: string): Promise<void> {
    if (await this.usersRepository.findOneByKey('email', email)) {
      throw new HttpException('email already in use', HttpStatus.CONFLICT);
    }

    if (await this.usersRepository.findOneByKey('username', username)) {
      throw new HttpException('username already in use', HttpStatus.CONFLICT);
    }
  }
}
