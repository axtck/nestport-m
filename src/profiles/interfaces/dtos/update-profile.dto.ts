import { IsBoolean, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { Null } from 'src/types/core.types';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(32)
  public firstName!: Null<string>;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  public lastName!: Null<string>;

  @IsOptional()
  @IsDateString()
  public dateOfBirth!: Null<string>;

  @IsOptional()
  @IsBoolean()
  public shouldDisplayUsername!: Null<boolean>;
}
