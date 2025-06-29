import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { PaymentscheduleService } from 'src/paymentschedule/paymentschedule.service';

@Module({
  controllers: [ContractController],
  providers: [ContractService, PaymentscheduleService],
})
export class ContractModule {}
