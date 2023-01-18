import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { paginationDto } from 'src/common/dto/pagination.dto';

export class GenericModuleDTO {
  @ApiProperty()
  @IsPositive()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  readonly isActive: boolean = true;
}

export class CreateModuleDto extends OmitType(GenericModuleDTO, [
  'id',
  'isActive',
]) {}

export class UpdateModuleDto extends PartialType(
  OmitType(GenericModuleDTO, ['id']),
) {}

export class FindModuleDto extends IntersectionType(
  PickType(PartialType(GenericModuleDTO), ['name']),
  paginationDto,
) {
  @ApiPropertyOptional({ default: true })
  @IsOptional()
  /** TRANSFORM STRING TO BOOLEAN */
  @Transform(({ obj, key }) => {
    const value = obj[key];
    if (typeof value === 'string') {
      return obj[key] === 'true';
    }
    return value;
  })
  readonly active?: boolean = true;
}
