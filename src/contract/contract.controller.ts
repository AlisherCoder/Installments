import { Controller, Get, Post, Body, Param, Req, UseGuards, Query } from '@nestjs/common';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { CommonApiQueries } from 'src/Common/api.decorator';
import { ApiQuery } from '@nestjs/swagger';
import { BaseSearchDto } from 'src/Common/query.dto';
import { ContractStatus, State } from '@prisma/client';

@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createContractDto: CreateContractDto, @Req() req: Request) {
    return this.contractService.create(createContractDto, req);
  }

  @UseGuards(AuthGuard)
  @Get()
  @CommonApiQueries()
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['createdAt', 'totalPrice'],
  })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'partnerId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, enum: ContractStatus })
  findAll(@Query() dto: BaseSearchDto) {
    return this.contractService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contractService.findOne(id);
  }
}
