import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ExchangesService } from './exchanges.service';
import { ExchangesController } from './exchanges.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [ExchangesController],
  providers: [ExchangesService, PrismaService]
})
export class ExchangesModule {}
