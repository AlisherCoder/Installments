import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { DebtService } from './debt.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CommonApiQueries } from 'src/Common/api.decorator';
import { ApiQuery } from '@nestjs/swagger';
import { BaseSearchDto } from 'src/Common/query.dto';

@Controller('debt')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @UseGuards(AuthGuard)
  @Get()
  @CommonApiQueries()
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['createdAt', 'total', 'due'],
  })
  @ApiQuery({ name: 'partnerId', required: false, type: String })
  findAll(@Query() dto: BaseSearchDto) {
    return this.debtService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debtService.findOne(id);
  }
}
