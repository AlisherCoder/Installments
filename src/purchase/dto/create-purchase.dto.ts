import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreatePurchaseDto {
  @ApiProperty({ example: 'partnerId', required: true })
  @IsUUID()
  partnerId: string;

  @ApiProperty({ example: 2, required: true })
  @IsInt()
  @Min(1)
  totalCount: number;

  @ApiProperty({ example: 300, required: true })
  @IsNumber()
  @IsPositive()
  totalPrice: number;

  @ApiProperty({ example: 'Optional note', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  note?: string;

  @ApiProperty({
    example: [
      { cost: 150, count: 1, productId: 'productId' },
      { cost: 150, count: 1, productId: 'productId' },
    ],
    required: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PurchaseItems)
  products: PurchaseItems[];
}

class PurchaseItems {
  @IsNumber()
  @IsPositive()
  cost: number;

  @IsInt()
  @Min(0)
  count: number;

  @IsUUID()
  productId: string;
}
