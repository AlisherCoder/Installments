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
import { BaseSearchDto } from 'src/Common/query.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

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

  async findAll(dto: BaseSearchDto) {
    const {
      page = 1,
      limit = 10,
      orderBy = 'desc',
      sortBy = 'createdAt',
      isActive = true,
      role = 'STAFF',
      fullname,
      phone,
    } = dto;
    const query: any = { role };

    if (fullname) query.fullname = { mode: 'insensitive', contains: fullname };
    if (phone) query.phone = { mode: 'insensitive', contains: phone };
    if (isActive == 'true') query.isActive = true;
    if (isActive == 'false') query.isActive = false;

    try {
      const data = await this.prisma.user.findMany({
        omit: { password: true },
        where: query,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: orderBy },
      });

      const totalPage = Math.ceil(data.length / limit);
      const total = data.length;
      return { data, totalPage, total };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        omit: { password: true },
        include: { Contract: true, Payment: true, Purchase: true },
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
