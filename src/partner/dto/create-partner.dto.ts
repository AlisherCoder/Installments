import { ApiProperty } from '@nestjs/swagger';
import { RolePartner } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';

class Location {
  @Type(() => Number)
  @IsNumber()
  lat: number;

  @Type(() => Number)
  @IsNumber()
  long: number;
}

export class CreatePartnerDto {
  @ApiProperty({ example: 'Jorj Oruel', required: true })
  @IsString()
  @IsNotEmpty()
  fullname: string;

  @ApiProperty({ example: '+998951234567', required: true })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+998[0-9]{2}\d{7}$/, {
    message: 'The phone number format must be only: +998901234567.',
  })
  phone: string;

  @ApiProperty({ example: '+998951234555', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+998[0-9]{2}\d{7}$/, {
    message: 'The phone number format must be only: +998901234567.',
  })
  secondPhone: string;

  @ApiProperty({ enum: RolePartner, required: true })
  @IsEnum(RolePartner)
  role: RolePartner;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  balance?: number;

  @ApiProperty({ example: 'Chilonzor 19', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @ApiProperty({ example: 'regionId', required: true })
  @IsUUID()
  regionId: string;

  @ApiProperty({ example: { lat: 23.21, long: 32.22 }, required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => Location)
  location?: Location;
}
