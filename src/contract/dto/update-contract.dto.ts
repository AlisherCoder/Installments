import { ApiProperty } from '@nestjs/swagger';
import { ContractStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateContractDto {
  @ApiProperty({ enum: ContractStatus, required: true })
  @IsEnum(ContractStatus)
  status: ContractStatus;
}
