import { ICreateUserDao } from '../daos/user.dao';
import { CreateUserDto } from '../dtos/create-user.dto';

export class CreateUserDtoMapper {
  public static toCreateUserDao(dto: CreateUserDto): ICreateUserDao {
    return {
      username: dto.username,
      email: dto.email,
      password: dto.password,
    };
  }
}
