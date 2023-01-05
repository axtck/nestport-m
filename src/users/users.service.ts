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
    const data: IUser[] = await this.usersRepository.findAll();
    return data;
  }

  public async findOne(userId: Id): Promise<IUser> {
    const data: IUser = await this.usersRepository.findOne(userId);
    return data;
  }

  public async findOneByUsername(username: string): Promise<Null<ILoginUser>> {
    const data: Null<ILoginUser> = await this.usersRepository.findOneByKey('username', username);
    return data;
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
