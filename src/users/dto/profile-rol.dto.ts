import { Type } from 'class-transformer';
import { IsPositive } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Profile } from '../entities';
import { Rol } from '../entities/rol.entity';

export class CreateProfileRolDto {
  @IsPositive()
  @Type(() => Number)
  @ApiProperty()
  readonly idProfile: number;

  @IsPositive()
  @Type(() => Number)
  @ApiProperty()
  readonly idRol: number;
}

export class CreateProfileRolsDto {
  @IsPositive()
  @Type(() => Number)
  @ApiProperty()
  readonly profile: Profile;

  @IsPositive()
  @Type(() => Number)
  @ApiProperty()
  readonly rol: Rol;
}

export class UpdateUserRolDto extends PartialType(CreateProfileRolDto) {}
