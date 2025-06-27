import { ApiProperty } from '@nestjs/swagger';
import { Units } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Iphone 15', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 500, required: true })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 'Iphone 15 lorem ipsum', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({ enum: Units, default: Units.DONA, required: true })
  @IsEnum(Units)
  unit: Units;

  @ApiProperty({ example: 'CategoryId', required: true })
  @IsUUID()
  categoryId: string;

  @ApiProperty({ example: 'image.jpg', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  image?: string;
}
