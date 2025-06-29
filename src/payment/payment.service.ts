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
      if (paymentType === PaymentType.IN && debtId) {
        const debt = await this.prisma.debt.findUnique({
          where: { id: debtId },
          include: {
            PaymentSchedule: {
              where: { paid: false },
              orderBy: { dueDate: 'asc' },
            },
          },
        });

        if (!debt) {
          throw new NotFoundException('Not found debt');
        }

        if (debt.due.lte(0)) {
          throw new BadRequestException('This debt has been paid.');
        }

        let remainingAmount = new Prisma.Decimal(amount);
        const updates: any = [];

        for (const schedule of debt.PaymentSchedule) {
          if (remainingAmount.lte(0)) break;

          const due = new Prisma.Decimal(schedule.amount);

          if (remainingAmount.gte(due)) {
            updates.push(
              this.prisma.paymentSchedule.update({
                where: { id: schedule.id },
                data: {
                  paid: true,
                  paidAt: new Date(),
                },
              }),
            );
            remainingAmount = remainingAmount.minus(due);
          } else {
            updates.push(
              this.prisma.paymentSchedule.update({
                where: { id: schedule.id },
                data: {
                  amount: due.minus(remainingAmount),
                },
              }),
            );
            remainingAmount = new Prisma.Decimal(0);
          }
        }

        const newDue = new Prisma.Decimal(debt.due).minus(
          amount - Number(remainingAmount),
        );

        updates.push(
          this.prisma.debt.update({
            where: { id: debtId },
            data: {
              due: newDue.lt(0) ? new Prisma.Decimal(0) : newDue,
            },
          }),
        );

        updates.push(
          this.prisma.partner.update({
            where: { id: debt.partnerId },
            data: {
              balance: { increment: new Prisma.Decimal(amount) },
            },
          }),
        );

        updates.push(
          this.prisma.payment.create({
            data: {
              ...createPaymentDto,
              partnerId: null,
              userId: user.id,
            },
          }),
        );

        if (newDue.eq(0)) {
          updates.push(
            this.prisma.contract.update({
              where: { id: debt.contractId },
              data: { status: 'DONE' },
            }),
          );
        }
        const data = await this.prisma.$transaction(updates);

        return { data };
      } else if (paymentType === PaymentType.OUT) {
        const seller = await this.prisma.partner.findUnique({
          where: { id: partnerId },
        });

        if (!seller) {
          throw new NotFoundException('Not found seller with id');
        }

        const data = await this.prisma.$transaction(async (tx) => {
          const payment = await tx.payment.create({
            data: { ...createPaymentDto, debtId: null, userId: user.id },
          });

          await tx.partner.update({
            where: { id: partnerId },
            data: { balance: { increment: amount } },
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
