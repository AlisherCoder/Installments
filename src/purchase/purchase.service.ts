import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RolePartner, State } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class PurchaseService {
  constructor(private prisma: PrismaService) {}

  async create(createPurchaseDto: CreatePurchaseDto, req: Request) {
    const { products, ...body } = createPurchaseDto;
    const user = req['user'];
    try {
      const seller = await this.prisma.partner.findUnique({
        where: { id: body.partnerId, role: 'SELLER' },
      });

      if (!seller) throw new NotFoundException('Not found seller');

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
        const prd = await this.prisma.product.findUnique({
          where: { id: item.productId },
        });

        item['previousCost'] = prd?.cost;
      }

      const data = await this.prisma.$transaction(async (tx) => {
        const purchase = await tx.purchase.create({
          data: {
            ...body,
            userId: user.id,
            PurchaseItems: {
              create: products,
            },
          },
          include: { PurchaseItems: true },
        });

        for (const item of products) {
          const prd: any = await tx.product.findUnique({
            where: { id: item.productId, isDeleted: false },
          });

          const currentSum = prd.stock * prd.cost.toNumber();
          const newSum = item.count * item.cost;
          const avgCost = (currentSum + newSum) / (prd.stock + item.count);

          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.count }, cost: avgCost },
          });

          await tx.partner.update({
            where: { id: body.partnerId },
            data: { balance: { decrement: body.totalPrice } },
          });
        }

        return purchase;
      });

      return { data };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const data = await this.prisma.purchase.findMany();

      return { data };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const purchase = await this.prisma.purchase.findUnique({
        where: { id },
        include: { PurchaseItems: true },
      });

      if (!purchase) {
        throw new NotFoundException('Not found purchase');
      }

      return { data: purchase };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updatePurchaseDto: UpdatePurchaseDto) {
    const { state } = updatePurchaseDto;
    try {
      if (state === State.DONE)
        throw new BadRequestException('The purchase can only be canceled.');

      const purchase = await this.prisma.purchase.findUnique({
        where: { id, state: 'DONE' },
      });

      if (!purchase) {
        throw new NotFoundException('Not found purchase');
      }

      const data = await this.prisma.$transaction(async (tx) => {
        const purchase = await tx.purchase.update({
          where: { id },
          data: { state },
          include: { PurchaseItems: true },
        });

        for (const item of purchase.PurchaseItems) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              cost: item.previousCost?.toDecimalPlaces(),
              stock: { decrement: item.count },
            },
          });
        }

        return purchase;
      });

      return { data };
    } catch (error) {
      throw error;
    }
  }
}
