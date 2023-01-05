import { IUser } from './user';

export interface ILoginUser extends IUser {
  password: string;
}
