import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateContractDto {
  @ApiProperty({ example: 'partnerId', required: true })
  @IsUUID()
  partnerId: string;

  @ApiProperty({ example: 200, required: true })
  @IsNumber()
  @IsPositive()
  totalPrice: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  prepayment?: number;

  @ApiProperty({ example: 3, required: true })
  @IsInt()
  @Min(1)
  time: number;

  @ApiProperty({
    example: [{ count: 2, price: 100, productId: 'productId' }],
    required: true,
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ContractItems)
  products: ContractItems[];
}

class ContractItems {
  @IsInt()
  @Min(1)
  count: number;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsUUID()
  productId: string;
}
