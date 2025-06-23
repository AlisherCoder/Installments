import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRegionDto {
  @ApiProperty({ example: 'Toshkent', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;
}
