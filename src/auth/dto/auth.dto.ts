import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
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
}

export class ResetPasswordDto extends PickType(LoginDto, ['phone']) {
  @ApiProperty({ example: '1234', required: true })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ example: 'root1234' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'The password must contain only letters and numbers.',
  })
  @MinLength(4)
  @MaxLength(32)
  newPassword: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'refresh token' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class SendOtpDto extends PickType(LoginDto, ['phone']) {}
