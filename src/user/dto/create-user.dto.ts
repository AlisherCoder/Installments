import { ApiProperty } from '@nestjs/swagger';
import { RoleUser } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Alex Ferguson', required: true })
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

  @ApiProperty({ example: '123456', required: true })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'The password must contain only letters and numbers.',
  })
  @MinLength(6)
  @MaxLength(32)
  password: string;

  @ApiProperty({ enum: RoleUser, required: true, default: RoleUser.STAFF })
  @IsEnum(RoleUser)
  role: RoleUser;
}
