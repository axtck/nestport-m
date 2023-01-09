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
  constructor(private readonly repository: UsersRepository, private readonly configHelper: ConfigHelper) {}

  private readonly authConfig: IAuthConfig = this.configHelper.getAuthConfig();

  public async findAll(): Promise<IUser[]> {
    return this.repository.findAll();
  }

  public async findOne(userId: Id): Promise<IUser> {
    const data: Null<IUser> = await this.repository.findOne(userId);
    if (!data) throw new Error('User not found');
    return data;
  }

  public async findOneByUsername(username: string): Promise<Null<ILoginUser>> {
    return this.repository.findOneByKey('username', username);
  }

  public async findOneByEmail(email: string): Promise<Null<ILoginUser>> {
    return this.repository.findOneByKey('email', email);
  }

  public async create(createUserDto: CreateUserDto): Promise<IUser> {
    await this.ensureUnique(createUserDto.email, createUserDto.username);

    const hashedPassword: string = await bcrypt.hash(createUserDto.password, this.authConfig.saltRounds);

    const userWithHashedPassword: CreateUserDto = {
      ...createUserDto,
      password: hashedPassword,
    };

    await this.repository.create(userWithHashedPassword);
    const createdUser: Null<ILoginUser> = await this.repository.findOneByKey(
      'username',
      userWithHashedPassword.username,
    );

    if (!createdUser) throw new Error('User not created');
    const { password, ...withoutPassword } = createdUser;
    return withoutPassword;
  }

  public async remove(userId: Id): Promise<void> {
    await this.repository.remove(userId);
  }

  private async ensureUnique(email: string, username: string): Promise<void> {
    if (await this.repository.findOneByKey('email', email)) {
      throw new HttpException('email already in use', HttpStatus.CONFLICT);
    }

    if (await this.repository.findOneByKey('username', username)) {
      throw new HttpException('username already in use', HttpStatus.CONFLICT);
    }
  }
}
