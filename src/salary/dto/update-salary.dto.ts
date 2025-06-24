import { ApiProperty } from '@nestjs/swagger';
import { State } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateSalaryDto {
  @ApiProperty({
    enum: State,
    default: State.CANCELED,
    required: true,
  })
  @IsEnum(State)
  state: State;
}
