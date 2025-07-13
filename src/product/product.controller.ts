import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request } from 'express';
import { BaseSearchDto } from 'src/Common/query.dto';
import { ApiQuery } from '@nestjs/swagger';
import { State } from '@prisma/client';
import { CommonApiQueries } from 'src/Common/api.decorator';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto, @Req() req: Request) {
    return this.productService.create(createProductDto, req);
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
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  findAll(@Query() dto: BaseSearchDto) {
    return this.productService.findAll(dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
