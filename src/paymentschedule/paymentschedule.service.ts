import { Injectable } from '@nestjs/common';
import { CreatePaymentscheduleDto } from './dto/create-paymentschedule.dto';
import { UpdatePaymentscheduleDto } from './dto/update-paymentschedule.dto';

@Injectable()
export class PaymentscheduleService {
  create(createPaymentscheduleDto: CreatePaymentscheduleDto) {
    return 'This action adds a new paymentschedule';
  }

  findAll() {
    return `This action returns all paymentschedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} paymentschedule`;
  }

  update(id: number, updatePaymentscheduleDto: UpdatePaymentscheduleDto) {
    return `This action updates a #${id} paymentschedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentschedule`;
  }
}
