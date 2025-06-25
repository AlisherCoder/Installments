import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { phone, password } = createUserDto;
    try {
      const user = await this.prisma.user.findUnique({ where: { phone } });

      if (user) {
        throw new ConflictException('User already exists with phone number');
      }

      const hashed = bcrypt.hashSync(password, 10);

      const data = await this.prisma.user.create({
        data: { ...createUserDto, password: hashed },
        omit: { password: true },
      });

      return { data };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const data = await this.prisma.user.findMany({
        omit: { password: true },
        where: { role: 'STAFF' },
      });

      const total = await this.prisma.user.count({
        where: { role: 'STAFF' },
      });

      return { data, total };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        omit: { password: true },
      });

      if (!user) {
        throw new NotFoundException('Not found user');
      }

      return { data: user };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { password, phone } = updateUserDto;
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('Not found user');
      }

      if (phone && user.phone !== phone) {
        const findPhone = await this.prisma.user.findUnique({
          where: { phone },
        });

        if (findPhone) {
          throw new ConflictException('User already exists with phone number');
        }
      }

      if (password) {
        const hashed = bcrypt.hashSync(password, 10);
        updateUserDto.password = hashed;
      }

      const data = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
        omit: { password: true },
      });

      return { data };
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('Not found user');
      }

      if (!user.isActive) {
        throw new BadRequestException('User already is not active');
      }

      const data = await this.prisma.user.update({
        where: { id },
        data: { isActive: false },
        omit: { password: true },
      });

      return { data };
    } catch (error) {
      throw error;
    }
  }
}
