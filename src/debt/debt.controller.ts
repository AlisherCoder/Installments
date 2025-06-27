import { Controller, Get, Param } from '@nestjs/common';
import { DebtService } from './debt.service';

@Controller('debt')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @Get()
  findAll() {
    return this.debtService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debtService.findOne(id);
  }
}
