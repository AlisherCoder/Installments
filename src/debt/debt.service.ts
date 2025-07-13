import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseSearchDto } from 'src/Common/query.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DebtService {
  constructor(private prisma: PrismaService) {}
  async findAll(dto: BaseSearchDto) {
    const { page = 1, limit = 10, orderBy = 'desc', sortBy = 'createdAt', partnerId } = dto;

    const query: any = {};

    if (partnerId) query.partnerId = partnerId;

    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.debt.findMany({
          where: query,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [sortBy]: orderBy },
        }),

        this.prisma.debt.count({ where: query }),
      ]);

      return { data, total };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.prisma.debt.findUnique({
        where: { id },
        include: { customer: true },
      });

      if (!data) {
        throw new NotFoundException('Not found debt');
      }

      return { data };
    } catch (error) {
      throw error;
    }
  }
}
