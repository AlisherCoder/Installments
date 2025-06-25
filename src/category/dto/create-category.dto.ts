import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Phone', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 3, required: true })
  @IsNumber()
  @IsInt()
  @Min(1)
  time: number;
}
