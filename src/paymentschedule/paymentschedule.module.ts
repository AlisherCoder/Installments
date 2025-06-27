import { Module } from '@nestjs/common';
import { PaymentscheduleService } from './paymentschedule.service';
import { PaymentscheduleController } from './paymentschedule.controller';

@Module({
  controllers: [PaymentscheduleController],
  providers: [PaymentscheduleService],
})
export class PaymentscheduleModule {}
