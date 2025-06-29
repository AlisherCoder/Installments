import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { State } from '@prisma/client';
import { count } from 'console';
import { BaseSearchDto } from 'src/Common/query.dto';

@Injectable()
export class SalaryService {
  constructor(private prisma: PrismaService) {}

  async create(createSalaryDto: CreateSalaryDto) {
    const { userId } = createSalaryDto;
    try {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException('Not found user');
      }

      if (!user.isActive) {
        throw new BadRequestException('User is not active');
      }

      const data = await this.prisma.$transaction(async (tx) => {
        const salary = await tx.salary.create({ data: createSalaryDto });

        await tx.user.update({
          where: { id: userId },
          data: { balance: { increment: salary.amount } },
        });

        return salary;
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
      userId,
      state = 'DONE',
      dateFrom,
      dateTo,
    } = dto;

    const query: any = { state };

    try {
      const data = await this.prisma.salary.findMany();
      const total = await this.prisma.salary.count();

      return { data, total };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateSalaryDto: UpdateSalaryDto) {
    const { state } = updateSalaryDto;
    try {
      const salary = await this.prisma.salary.findUnique({
        where: { id },
      });

      if (!salary) {
        throw new NotFoundException('Salary not found');
      }

      if (salary.state === State.CANCELED) {
        throw new BadRequestException('Salary already cancaled');
      }

      if (state === State.DONE) {
        return { data: salary };
      }

      const data = await this.prisma.$transaction(async (tx) => {
        const salary = await tx.salary.update({
          where: { id },
          data: { state },
        });

        await tx.user.update({
          where: { id: salary.userId },
          data: { balance: { decrement: salary.amount } },
        });

        return salary;
      });

      return { data };
    } catch (error) {
      throw error;
    }
  }
}
