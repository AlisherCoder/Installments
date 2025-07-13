import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentService } from './payment.service';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { CommonApiQueries } from 'src/Common/api.decorator';
import { ApiQuery } from '@nestjs/swagger';
import { BaseSearchDto } from 'src/Common/query.dto';
import { PaymentMethod, PaymentType } from '@prisma/client';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto, @Req() req: Request) {
    return this.paymentService.create(createPaymentDto, req);
  }

  @Get()
  @CommonApiQueries()
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['createdAt', 'amount'],
  })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'partnerId', required: false, type: String })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  @ApiQuery({ name: 'paymentMethod', required: false, enum: PaymentMethod })
  @ApiQuery({ name: 'paymentType', required: false, enum: PaymentType })
  findAll(@Query() dto: BaseSearchDto) {
    return this.paymentService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }
}
