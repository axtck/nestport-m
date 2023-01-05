import { Id } from 'src/types/core.types';

export interface IUserDao {
  id: Id;
  username: string;
  email: string;
}

export interface ILoginUserDao extends IUserDao {
  password: string;
}

export interface ICreateUserDao extends Omit<IUserDao, 'id'> {
  password: string;
}
