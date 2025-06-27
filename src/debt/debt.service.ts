import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DebtService {
  constructor(private prisma: PrismaService) {}
  async findAll() {
    try {
      const data = await this.prisma.debt.findMany();

      return { data };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.prisma.debt.findUnique({ where: { id } });

      if (!data) {
        throw new NotFoundException('Not found debt');
      }

      return { data };
    } catch (error) {
      throw error;
    }
  }
}
