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
  readonly name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly nameRoute: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  readonly escription?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly icon: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  readonly isActive: boolean = true;

  @ApiProperty({ default: false })
  @IsBoolean()
  readonly isPublic: boolean = false;
}

export class CreateModuleDto extends OmitType(GenericModuleDTO, [
  'id',
  'isActive',
]) {}

export class UpdateModuleDto extends PartialType(
  OmitType(GenericModuleDTO, ['id']),
) {}

export class FindModuleDto extends PartialType(paginationDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  readonly name: string;

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
