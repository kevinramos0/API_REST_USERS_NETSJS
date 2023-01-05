import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsPositive, Min } from 'class-validator';

export class paginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // enableImplicitConversions: true
  @ApiPropertyOptional({ default: 10 })
  readonly limit: number;

  @IsOptional()
  @IsPositive()
  @Min(1)
  @Type(() => Number) // enableImplicitConversions: true
  @ApiPropertyOptional({ default: 1 })
  readonly offset: number;

  @IsBoolean()
  @IsOptional()
  /** TRANSFORM STRING TO BOOLEAN */
  @Transform(({ obj, key }) => {
    const value = obj[key];
    if (typeof value === 'string') {
      return obj[key] === 'true';
    }
    return value;
  })
  @ApiPropertyOptional({ default: true })
  readonly pagination: boolean;
}
