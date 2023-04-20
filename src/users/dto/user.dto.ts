import {
  PartialType,
  PickType,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { paginationDto } from '../../common/dto/pagination.dto';
import { Transform, Type } from 'class-transformer';
import { CreateNewPasswordDto } from '../../auth/dto/auth.dto';

export class GenericUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  @Transform((param) => param.value.toLowerCase())
  readonly email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @IsNotEmpty()
  @ApiProperty()
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  readonly password: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  readonly isActive: boolean = false;

  @ApiProperty({ default: false })
  @IsBoolean()
  readonly isVerified: boolean = false;

  @ApiProperty({ required: false })
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  readonly profile: number;
}

export class CreateUserDto extends PickType(GenericUserDto, [
  'email',
  'password',
  'profile',
] as const) {}

export class UpdateUserDto extends PickType(PartialType(GenericUserDto), [
  'email',
  'profile',
] as const) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  readonly isActive: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  readonly isVerified: boolean;
}

export class searchUserDto extends paginationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  readonly email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  /** TRANSFORM STRING TO BOOLEAN */
  @Transform(({ obj, key }) => {
    const value = obj[key];
    if (typeof value === 'string') {
      return obj[key] === 'true';
    }
    return value;
  })
  readonly active?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  /** TRANSFORM STRING TO BOOLEAN */
  @Transform(({ obj, key }) => {
    const value = obj[key];
    if (typeof value === 'string') {
      return obj[key] === 'true';
    }
    return value;
  })
  readonly verified?: boolean;
}

export class FindOneUserDto {
  @IsOptional()
  @IsEmail()
  @IsString()
  readonly email?: string;

  @IsPositive()
  @IsOptional()
  readonly id?: number;
}

export class ChangePasswordDto extends CreateNewPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  oldPassword: string;
}
