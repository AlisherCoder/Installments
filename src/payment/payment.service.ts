import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentType, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async create(createPaymentDto: CreatePaymentDto, req: Request) {
    const { partnerId, debtId, paymentType, amount } = createPaymentDto;
    const user = req['user'];

    try {
      const partner = await this.prisma.partner.findUnique({
        where: { id: partnerId },
      });

      if (!partner) {
        throw new NotFoundException('Not found partner with by id');
      }

      if (paymentType === PaymentType.IN && partner.role === 'CUSTOMER') {
        if (debtId) {
          const primaryDebt = await this.prisma.debt.findUnique({
            where: { id: debtId, due: { gt: 0 } },
          });

          if (!primaryDebt) {
            throw new NotFoundException('Not found debt');
          }

          const data = await this.prisma.$transaction(async (tsx) => {
            const payment = await tsx.payment.create({
              data: { ...createPaymentDto, userId: user.id },
            });

            let remaining = new Prisma.Decimal(createPaymentDto.amount);

            const primaryDue = new Prisma.Decimal(primaryDebt.due);

            if (remaining.gte(primaryDue)) {
              await tsx.debt.update({
                where: { id: primaryDebt.id },
                data: { due: new Prisma.Decimal(0) },
              });
              remaining = remaining.minus(primaryDue);
            } else {
              await tsx.debt.update({
                where: { id: primaryDebt.id },
                data: { due: primaryDue.minus(remaining) },
              });
              remaining = new Prisma.Decimal(0);
            }

            if (remaining.gt(0)) {
              const otherDebts = await tsx.debt.findMany({
                where: {
                  partnerId: primaryDebt.partnerId,
                  due: { gt: 0 },
                  NOT: { id: primaryDebt.id },
                },
                orderBy: { createdAt: 'asc' },
              });

              for (const debt of otherDebts) {
                if (remaining.lte(0)) break;

                const due = new Prisma.Decimal(debt.due);

                if (remaining.gte(due)) {
                  await tsx.debt.update({
                    where: { id: debt.id },
                    data: { due: new Prisma.Decimal(0) },
                  });
                  remaining = remaining.minus(due);
                } else {
                  await tsx.debt.update({
                    where: { id: debt.id },
                    data: { due: due.minus(remaining) },
                  });
                  remaining = new Prisma.Decimal(0);
                }
              }
            }

            if (remaining.gt(0)) {
              await tsx.partner.update({
                where: { id: partnerId },
                data: {
                  balance: { increment: remaining },
                  paidToday: new Date(),
                },
              });
            } else {
              await tsx.partner.update({
                where: { id: partnerId },
                data: { paidToday: new Date() },
              });
            }

            return payment;
          });

          return { data };
        }

        const data = await this.prisma.$transaction(async (tsx) => {
          const payment = await tsx.payment.create({
            data: { ...createPaymentDto, userId: user.id },
          });

          let remaining = new Prisma.Decimal(createPaymentDto.amount);

          const debts = await tsx.debt.findMany({
            where: {
              partnerId: createPaymentDto.partnerId,
              due: { gt: 0 },
            },
            orderBy: { createdAt: 'asc' },
          });

          for (const debt of debts) {
            if (remaining.lte(0)) break;

            const due = new Prisma.Decimal(debt.due);

            if (remaining.gte(due)) {
              await tsx.debt.update({
                where: { id: debt.id },
                data: { due: new Prisma.Decimal(0) },
              });
              remaining = remaining.minus(due);
            } else {
              await tsx.debt.update({
                where: { id: debt.id },
                data: { due: due.minus(remaining) },
              });
              remaining = new Prisma.Decimal(0);
            }
          }

          if (remaining.gt(0)) {
            await tsx.partner.update({
              where: { id: createPaymentDto.partnerId },
              data: {
                balance: { increment: remaining },
                paidToday: new Date(),
              },
            });
          }

          return payment;
        });

        return { data };
      } else if (paymentType === PaymentType.OUT) {
        const data = await this.prisma.$transaction(async (tx) => {
          const payment = await tx.payment.create({
            data: { ...createPaymentDto, debtId: null, userId: user.id },
          });

          await tx.partner.update({
            where: { id: partnerId },
            data: { balance: { decrement: amount } },
          });

          return payment;
        });

        return { data };
      } else {
        throw new BadRequestException('Validation error');
      }
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const data = await this.prisma.payment.findMany();

      return { data };
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const payment = await this.prisma.payment.findUnique({ where: { id } });

      if (!payment) {
        throw new NotFoundException('Not found payment');
      }

      return { data: payment };
    } catch (error) {
      throw error;
    }
  }
}
