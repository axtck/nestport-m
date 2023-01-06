import { Injectable } from '@nestjs/common';
import { Repository } from 'src/database/repository';
import { Id, Null, QueryString } from 'src/types/core.types';
import { CreateUserDto } from './interfaces/dtos/create-user.dto';
import { ILoginUser } from './interfaces/models/auth-user';
import { IUser } from './interfaces/models/user';

@Injectable()
export class UsersRepository extends Repository {
  public async findAll(): Promise<IUser[]> {
    const findQuery: QueryString = 'SELECT id, username, email FROM users';
    const userDbs = await this.database.query<IUserDb>(findQuery);
    return userDbs.map(this.toUser);
  }

  public async findOne(userId: Id): Promise<Null<IUser>> {
    const findQuery: QueryString = 'SELECT id, username, email FROM users WHERE id = ?';
    const userDb: Null<IUserDb> = await this.database.queryOne<IUserDb>(findQuery, [userId]);
    return userDb ? this.toUser(userDb) : null;
  }

  public async findOneByKey(type: 'username' | 'email', key: string): Promise<Null<ILoginUser>> {
    const findQuery: QueryString = `SELECT id, username, email, password FROM users WHERE ${type} = ?`;
    const loginUserDb: Null<ILoginUserDb> = await this.database.queryOne<ILoginUserDb>(findQuery, [key]);
    return loginUserDb ? this.toLoginUser(loginUserDb) : null;
  }

  public async create(createUser: CreateUserDto): Promise<void> {
    const createQuery: QueryString = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    await this.database.query(createQuery, [createUser.username, createUser.email, createUser.password]);
  }

  public async remove(userId: Id): Promise<void> {
    const removeQuery: QueryString = 'DELETE FROM users WHERE id = ?';
    await this.database.query(removeQuery, [userId]);
  }

  private toUser(userDb: IUserDb): IUser {
    return {
      id: userDb.id,
      username: userDb.username,
      email: userDb.email,
    };
  }

  private toLoginUser(loginUserDb: ILoginUserDb): ILoginUser {
    return {
      ...this.toUser(loginUserDb),
      password: loginUserDb.password,
    };
  }
}

interface IUserDb {
  id: Id;
  username: string;
  email: string;
}

interface ILoginUserDb extends IUserDb {
  password: string;
}
