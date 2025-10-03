import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { CompaniesModule } from './companies/companies.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ProductsModule, CompaniesModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
