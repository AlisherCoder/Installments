import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePartnerDto } from './create-partner.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePartnerDto extends PartialType(CreatePartnerDto) {
  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
