import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreatePurchaseDto {
  @ApiProperty({ example: 'partnerId', required: true })
  @IsUUID()
  partnerId: string;

  @ApiProperty({ example: 'productId', required: true })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 2, required: true })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 300, required: true })
  @IsNumber()
  @IsPositive()
  totalPrice: number;

  @ApiProperty({ example: 'Optional note', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  note?: string;
}
