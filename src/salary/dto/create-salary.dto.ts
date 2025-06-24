import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateSalaryDto {
  @ApiProperty({ example: 'userId', required: true })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 1500000, required: true })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 'optional', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(256)
  comment?: string;
}
