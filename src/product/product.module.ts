import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { PurchaseService } from 'src/purchase/purchase.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PurchaseService],
})
export class ProductModule {}
