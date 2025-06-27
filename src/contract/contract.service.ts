import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class ContractService {
  constructor(private prisma: PrismaService) {}

  async create(createContractDto: CreateContractDto, req: Request) {
    const { products, ...body } = createContractDto;
    const user = req['user'];
    try {
      const customer = await this.prisma.partner.findUnique({
        where: { id: body.partnerId, role: 'CUSTOMER' },
      });

      if (!customer) throw new NotFoundException('Not found customer');

      const warehouse = (
        await this.prisma.product.findMany({
          where: { isDeleted: false },
          select: { id: true },
        })
      ).map((prd) => prd.id);

      for (const item of products) {
        if (!warehouse.includes(item.productId)) {
          throw new NotFoundException('Not found product');
        }
      }

      const data = await this.prisma.$transaction(async (tx) => {
        const contract = await tx.contract.create({
          data: {
            ...body,
            userId: user.id,
            ContractItems: {
              create: products,
            },
          },
          include: { ContractItems: true },
        });

        for (const item of products) {
          const prd = await tx.product.findUnique({
            where: {
              id: item.productId,
              isDeleted: false,
              stock: { gte: item.count },
            },
          });

          if (!prd) {
            throw new BadRequestException('Not enough product quantity');
          }

          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.count } },
          });
        }

        const debt = await tx.debt.create({
          data: {
            partnerId: customer.id,
            contractId: contract.id,
            total: contract.totalPrice,
            due: contract.totalPrice,
          },
        });

        await tx.partner.update({
          where: { id: customer.id },
          data: { balance: { decrement: debt.due } },
        });

        return { contract, debt };
      });

      return { data };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const data = await this.prisma.contract.findMany();

      return { data };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const data = await this.prisma.contract.findUnique({ where: { id } });

      if (!data) {
        throw new NotFoundException('Not found contract');
      }

      return { data };
    } catch (error) {
      throw error;
    }
  }
}
