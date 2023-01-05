import { Injectable } from '@nestjs/common';
import { Repository } from 'src/core/repository';
import { Id, Null, QueryString } from 'src/types/core.types';
import { ILoginUserDao, ICreateUserDao, IUserDao } from './interfaces/daos/user.dao';
import { CreateUserDto } from './interfaces/dtos/create-user.dto';
import { IUser } from './interfaces/models/user';
import { CreateUserDtoMapper } from './interfaces/mappers/create-user-dto.mapper';
import { UserDaoMapper } from './interfaces/mappers/user-dao.mapper';
import { ILoginUser } from './interfaces/models/auth-user';
import { AuthUserDaoMapper } from './interfaces/mappers/auth-user-dao.mapper';

@Injectable()
export class UsersRepository extends Repository {
  public async findAll(): Promise<IUser[]> {
    const findQuery: QueryString = 'SELECT u.username, u.email FROM users u';
    const userDaos: IUserDao[] = await this.database.query<IUserDao>(findQuery);
    return userDaos.map(UserDaoMapper.toModel);
  }

  public async findOne(userId: Id): Promise<IUser> {
    const findQuery: QueryString = 'SELECT u.id, u.username, u.email FROM users u WHERE u.id = $1';
    const userDao: IUserDao = await this.database.queryOne<IUserDao>(findQuery, [userId]);
    return UserDaoMapper.toModel(userDao);
  }

  public async findOneByKey(type: 'username' | 'email', key: string): Promise<Null<ILoginUser>> {
    const findQuery: QueryString = `SELECT u.id, u.username, u.email, u.password FROM users u WHERE u.${type} = $1`;
    const userDao: Null<ILoginUserDao> = await this.database.queryOneOrDefault<ILoginUserDao>(findQuery, [key]);
    return userDao ? AuthUserDaoMapper.toModel(userDao) : null;
  }

  public async create(createUser: CreateUserDto): Promise<void> {
    const createUserDao: ICreateUserDao = CreateUserDtoMapper.toCreateUserDao(createUser);
    const createQuery: QueryString = 'INSERT INTO "users" ("username", "email", "password") VALUES ($1, $2, $3)';
    await this.database.query(createQuery, [createUserDao.username, createUserDao.email, createUserDao.password]);
  }

  public async remove(userId: Id): Promise<void> {
    const removeQuery: QueryString = 'DELETE FROM "users" WHERE "id" = $1';
    await this.database.query(removeQuery, [userId]);
  }
}
