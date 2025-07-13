import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto, ResetPasswordDto, SendOtpDto } from './dto/auth.dto';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { totp } from 'otplib';
import { EskizeService } from 'src/eskize/eskize.service';
totp.options = { digits: 5, step: 600 };

@Injectable()
export class AuthService {
  private acckey = process.env.ACC_KEY;
  private refkey = process.env.REF_KEY;
  private otpkey = process.env.OTP_KEY;
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private eskizService: EskizeService,
  ) {}

  async login(loginDto: LoginDto) {
    const { phone, password } = loginDto;
    try {
      const user = await this.prisma.user.findUnique({ where: { phone } });

      if (!user) {
        throw new UnauthorizedException('Not found user');
      }

      const isValid = bcrypt.compareSync(password, user.password);

      if (!isValid) {
        throw new UnauthorizedException('Password or phone number is wrong');
      }

      if (!user.isActive) {
        throw new ForbiddenException('Your account is not active');
      }

      const payload = { id: user.id, role: user.role, status: user.isActive };
      const accessToken = this.genAccessToken(payload);
      const refreshToken = this.genRefreshToken(payload);

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  async sendOtp(sendOtpDto: SendOtpDto) {
    const { phone } = sendOtpDto;
    try {
      const user = await this.prisma.user.findUnique({ where: { phone } });

      if (!user) {
        throw new UnauthorizedException('Not found user');
      }

      const otp = totp.generate(this.otpkey + phone);
      // await this.eskizService.sendSms(otp, phone);

      return { data: 'OTP send to your number', otp };
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { newPassword, phone, otp } = resetPasswordDto;
    try {
      const isValid = totp.check(otp, this.otpkey + phone);

      if (!isValid) {
        throw new UnauthorizedException('OTP code or phone number is wrong');
      }

      const hashed = bcrypt.hashSync(newPassword, 10);

      await this.prisma.user.update({
        where: { phone },
        data: { password: hashed },
      });

      return { data: 'Your password updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(req: Request) {
    const user = req['user'];
    try {
      const payload = { id: user.id, role: user.role, status: user.isActive };

      const accessToken = this.genAccessToken(payload);

      return { accessToken };
    } catch (error) {
      throw error;
    }
  }

  async getMe(req: Request) {
    const user = req['user'];
    try {
      const data = await this.prisma.user.findUnique({
        where: { id: user.id },
        omit: { password: true },
        include: {
          Contract: true,
          Payment: true,
        },
      });

      return { data };
    } catch (error) {
      throw error;
    }
  }

  genAccessToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.acckey,
      expiresIn: '12h',
    });
  }

  genRefreshToken(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.refkey,
      expiresIn: '7d',
    });
  }
}
