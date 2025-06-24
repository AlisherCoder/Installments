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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    RegionModule,
    UserModule,
    SalaryModule,
    PartnerModule,
  ],
  controllers: [AppController],
  providers: [AppService, EskizeService],
})
export class AppModule {}
