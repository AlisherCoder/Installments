import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { State } from '@prisma/client';
import { Request } from 'express';
import { BaseSearchDto } from 'src/Common/query.dto';

@Injectable()
export class PurchaseService {
  constructor(private prisma: PrismaService) { }

  async create(createPurchaseDto: CreatePurchaseDto, req: Request) {
    const { partnerId, productId, quantity, totalPrice } = createPurchaseDto;
    const user = req['user'];

    try {
      const seller = await this.prisma.partner.findUnique({
        where: { id: partnerId, role: 'SELLER' },
      });

      if (!seller) throw new NotFoundException('Not found seller');

      const prd = await this.prisma.product.findUnique({
        where: { id: productId, isDeleted: false },
      });

      if (!prd) {
        throw new NotFoundException('Not found product');
      }

      if (prd.quantity < quantity) {
        throw new BadRequestException('Not enough product quantity');
      }

      const data = await this.prisma.$transaction(async (tx) => {
        const purchase = await tx.purchase.create({
          data: {
            userId: user.id,
            ...createPurchaseDto,
          },
        });

        await tx.product.update({
          where: { id: productId },
          data: { quantity: { increment: quantity }, totalPrice: { increment: totalPrice } },
        });

        await tx.partner.update({
          where: { id: partnerId },
          data: { balance: { increment: totalPrice } },
        });

        return purchase;
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
      partnerId,
      productId,
      state = 'DONE',
      dateFrom,
      dateTo,
    } = dto;

    const query: any = { state };

    if (userId) query.userId = userId;
    if (partnerId) query.partnerId = partnerId;
    if (productId) query.productIduId;

    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.gte = new Date(dateFrom);
      if (dateTo) query.createdAt.lte = new Date(dateTo);
    }

    try {
      const [data, total] = await this.prisma.$transaction([
        this.prisma.purchase.findMany({
          where: query,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { [sortBy]: orderBy },
        }),

        this.prisma.purchase.count({ where: query }),
      ]);

      return { data, total };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const purchase = await this.prisma.purchase.findUnique({
        where: { id },
        include: {
          product: true,
          user: {
            select: {
              id: true,
              fullname: true,
              phone: true,
            },
          },
          seller: {
            select: {
              fullname: true,
              phone: true,
              secondPhone: true,
              id: true,
            },
          },
        },
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
      if (state === State.DONE) throw new BadRequestException('The purchase can only be canceled.');

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
        });

        await tx.product.update({
          where: { id: purchase.productId },
          data: { quantity: { increment: purchase.quantity } },
        });

        await tx.partner.update({
          where: { id: purchase.partnerId },
          data: { balance: { decrement: purchase.totalPrice } },
        });

        return purchase;
      });

      return { data };
    } catch (error) {
      throw error;
    }
  }
}
