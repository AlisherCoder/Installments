import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentscheduleService } from './paymentschedule.service';
import { CreatePaymentscheduleDto } from './dto/create-paymentschedule.dto';
import { UpdatePaymentscheduleDto } from './dto/update-paymentschedule.dto';

@Controller('paymentschedule')
export class PaymentscheduleController {
  constructor(private readonly paymentscheduleService: PaymentscheduleService) {}

  @Post()
  create(@Body() createPaymentscheduleDto: CreatePaymentscheduleDto) {
    return this.paymentscheduleService.create(createPaymentscheduleDto);
  }

  @Get()
  findAll() {
    return this.paymentscheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentscheduleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentscheduleDto: UpdatePaymentscheduleDto) {
    return this.paymentscheduleService.update(+id, updatePaymentscheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentscheduleService.remove(+id);
  }
}
