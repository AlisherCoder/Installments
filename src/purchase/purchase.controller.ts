import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { BaseSearchDto } from 'src/Common/query.dto';
import { ApiQuery } from '@nestjs/swagger';
import { CommonApiQueries } from 'src/Common/api.decorator';
import { State } from '@prisma/client';

@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createPurchaseDto: CreatePurchaseDto, @Req() req: Request) {
    return this.purchaseService.create(createPurchaseDto, req);
  }

  @UseGuards(AuthGuard)
  @Get()
  @CommonApiQueries()
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['createdAt', 'totalPrice', 'quantity'],
  })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'partnerId', required: false, type: String })
  @ApiQuery({ name: 'productId', required: false, type: String })
  @ApiQuery({ name: 'state', required: false, enum: State })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  findAll(@Query() dto: BaseSearchDto) {
    return this.purchaseService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePurchaseDto: UpdatePurchaseDto) {
    return this.purchaseService.update(id, updatePurchaseDto);
  }
}
