import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';
import { emailRegex } from 'src/utils/pattern-utils';
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(32)
  @Matches(/^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+$/, {
    message: 'username format invalid',
  })
  public username!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @Matches(emailRegex, {
    message: 'email format invalid',
  })
  public email!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'password not strong enough',
  })
  public password!: string;
}
