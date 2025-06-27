import { PartialType } from '@nestjs/swagger';
import { CreatePaymentscheduleDto } from './create-paymentschedule.dto';

export class UpdatePaymentscheduleDto extends PartialType(CreatePaymentscheduleDto) {}
