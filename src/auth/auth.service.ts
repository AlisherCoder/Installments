import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, ResetPasswordDto } from './dto/auth.dto';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private acckey = process.env.ACC_KEY;
  private refkey = process.env.REF_KEY;
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto, req: Request) {
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

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { newPassword, phone, otp } = resetPasswordDto;
    try {
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
