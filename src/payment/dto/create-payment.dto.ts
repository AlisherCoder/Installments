import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod, PaymentType } from '@prisma/client';
import {
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 'partnerId', required: true })
  @IsUUID()
  partnerId: string;

  @ApiProperty({ example: 0, required: true })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 'debtId', required: false })
  @IsUUID()
  debtId?: string;

  @ApiProperty({ example: 'optional comment', required: false })
  @IsString()
  comment?: string;

  @ApiProperty({ enum: PaymentMethod, required: true })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ enum: PaymentType, required: true })
  @IsEnum(PaymentMethod)
  paymentType: PaymentType;
}
