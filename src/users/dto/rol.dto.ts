import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  PickType,
  PartialType,
  OmitType,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { paginationDto } from '../../common/dto/pagination.dto';
import { Transform } from 'class-transformer';

// import { OmitType, PartialType } from '@nestjs/mapped-types';

export class GenericRolDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  readonly description: string;

  @IsBoolean()
  @IsOptional()
  @IsNotEmpty()
  readonly isActive: boolean;

  @IsDate()
  @IsNotEmpty()
  readonly createdAt: Date;

  @IsDate()
  @IsNotEmpty()
  readonly updatedAt: Date;
}

export class CreateRolDto extends PickType(GenericRolDto, [
  'name',
  'description',
] as const) {}

export class UpdateRolDto extends PartialType(
  OmitType(GenericRolDto, ['createdAt', 'updatedAt'] as const),
) {}

export class SearchRolDto extends PartialType(paginationDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @IsBoolean()
  /** TRANSFORM STRING TO BOOLEAN */
  @Transform(({ obj, key }) => {
    const value = obj[key];
    if (typeof value === 'string') {
      return obj[key] === 'true';
    }
    return value;
  })
  readonly active: boolean;
}
