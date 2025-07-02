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
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';
import { BaseSearchDto } from 'src/Common/query.dto';
import { CommonApiQueries } from 'src/Common/api.decorator';
import { ApiQuery } from '@nestjs/swagger';
import { RolePartner } from '@prisma/client';

@Controller('partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createPartnerDto: CreatePartnerDto, @Req() req: Request) {
    return this.partnerService.create(createPartnerDto, req);
  }

  @Get()
  @CommonApiQueries()
  @ApiQuery({
    name: 'sortBy',
    required: false,
    enum: ['createdAt', 'fullname', 'balance'],
  })
  @ApiQuery({ name: 'isActive', required: false, enum: ['true', 'false'] })
  @ApiQuery({ name: 'isArchive', required: false, enum: ['true', 'false'] })
  @ApiQuery({ name: 'role', required: false, enum: RolePartner })
  findAll(@Query() dto: BaseSearchDto) {
    return this.partnerService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.partnerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    return this.partnerService.update(id, updatePartnerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.partnerService.remove(id);
  }
}
