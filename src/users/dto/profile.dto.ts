import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { paginationDto } from '../../common/dto/pagination.dto';
import {
  PartialType,
  PickType,
  IntersectionType,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GenericProfileDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsBoolean()
  @IsOptional()
  readonly isActive: boolean;

  @IsDate()
  @IsOptional()
  readonly updatedAt: Date;

  @IsDate()
  @IsOptional()
  readonly createdAt: Date;
}
export class CreateProfileDto extends PickType(GenericProfileDto, [
  'name',
  'description',
] as const) {
  @ApiPropertyOptional({ type: Number, isArray: true })
  @IsOptional()
  @IsPositive({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  readonly rols?: number[];

  @ApiPropertyOptional({ type: Number, isArray: true })
  @IsOptional()
  @IsPositive({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  readonly modules?: number[];
}
export class UpdateProfileDto extends IntersectionType(
  PartialType(CreateProfileDto),
  PickType(GenericProfileDto, ['isActive'] as const),
) {}

export class searchProfileDTO extends PartialType(paginationDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly name: string;

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
  readonly active: boolean;
}
