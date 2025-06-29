import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SalaryService } from './salary.service';
import { CreateSalaryDto } from './dto/create-salary.dto';
import { UpdateSalaryDto } from './dto/update-salary.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CommonApiQueries } from 'src/Common/api.decorator';
import { ApiQuery } from '@nestjs/swagger';
import { State } from '@prisma/client';
import { BaseSearchDto } from 'src/Common/query.dto';

@Controller('salary')
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createSalaryDto: CreateSalaryDto) {
    return this.salaryService.create(createSalaryDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  @CommonApiQueries()
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['createdAt', 'amount'],
  })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'state', required: false, enum: State })
  @ApiQuery({ name: 'dateTo', required: false, type: String })
  @ApiQuery({ name: 'dateFrom', required: false, type: String })
  findAll(@Query() dto: BaseSearchDto) {
    return this.salaryService.findAll(dto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSalaryDto: UpdateSalaryDto) {
    return this.salaryService.update(id, updateSalaryDto);
  }
}
