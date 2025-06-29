import { Injectable } from '@nestjs/common';
import { addMonths } from 'date-fns';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaymentscheduleService {
  create(data: any) {
    const { contractId, debtId, time, amount } = data;

    try {
      const monthlyAmount = new Prisma.Decimal(amount).div(time);

      const schedules: any = [];

      for (let i = 1; i <= time; i++) {
        schedules.push({
          contractId,
          debtId,
          dueDate: addMonths(new Date(), i),
          amount: monthlyAmount,
        });
      }

      return schedules;
    } catch (error) {
      throw error;
    }
  }
}
