import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionService.create(createRegionDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.regionService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regionService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regionService.remove(id);
  }
}
