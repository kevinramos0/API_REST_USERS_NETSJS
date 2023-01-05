import { ApiProperty, PickType } from '@nestjs/swagger';
import {
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

class UserAuthDto {
  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  readonly password: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsJWT()
  refreshToken: string;
}

export class LoginUserDto extends PickType(UserAuthDto, ['email'] as const) {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

export class CreateNewPasswordDto extends PickType(UserAuthDto, [
  'password',
] as const) {
  @ApiProperty()
  @IsString()
  confirmPassword: string;
}

export class ResetPasswordDto extends PickType(UserAuthDto, [
  'email',
] as const) {}
