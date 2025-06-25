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
} from '@nestjs/common';
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createPartnerDto: CreatePartnerDto, @Req() req: Request) {
    return this.partnerService.create(createPartnerDto, req);
  }

  @Get()
  findAll() {
    return this.partnerService.findAll();
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
