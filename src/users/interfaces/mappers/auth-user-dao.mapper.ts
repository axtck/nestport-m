import { ILoginUserDao } from '../daos/user.dao';
import { ILoginUser } from '../models/auth-user';

export class AuthUserDaoMapper {
  public static toModel(dao: ILoginUserDao): ILoginUser {
    return {
      id: dao.id,
      username: dao.username,
      email: dao.email,
      password: dao.password,
    };
  }
}
