import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod, PaymentType } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ example: 'partnerId', required: true })
  @IsUUID()
  partnerId: string;

  @ApiProperty({ example: 0, required: true })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ example: 'debtId', required: false })
  @IsOptional()
  @IsUUID()
  debtId?: string;

  @ApiProperty({ example: 'comment', required: false })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ enum: PaymentMethod, required: true })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({ enum: PaymentType, required: true })
  @IsEnum(PaymentType)
  paymentType: PaymentType;
}
