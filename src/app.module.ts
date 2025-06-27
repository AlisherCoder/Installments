import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EskizeService } from './eskize/eskize.service';
import { RegionModule } from './region/region.module';
import { UserModule } from './user/user.module';
import { SalaryModule } from './salary/salary.module';
import { PartnerModule } from './partner/partner.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UploadModule } from './upload/upload.module';
import { PurchaseModule } from './purchase/purchase.module';
import { ContractModule } from './contract/contract.module';
import { DebtModule } from './debt/debt.module';
import { PaymentModule } from './payment/payment.module';
import { PaymentscheduleModule } from './paymentschedule/paymentschedule.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/file',
    }),
    PrismaModule,
    AuthModule,
    RegionModule,
    UserModule,
    SalaryModule,
    PartnerModule,
    CategoryModule,
    ProductModule,
    UploadModule,
    PurchaseModule,
    ContractModule,
    DebtModule,
    PaymentModule,
    PaymentscheduleModule,
  ],
  controllers: [AppController],
  providers: [AppService, EskizeService],
})
export class AppModule {}
