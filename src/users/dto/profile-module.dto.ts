import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsPositive } from 'class-validator';

export class ProfileModuleDTO {
  @ApiProperty({ type: Number, isArray: true })
  @IsPositive({ each: true })
  @IsArray()
  @ArrayMinSize(1)
  modules: number[];
}
