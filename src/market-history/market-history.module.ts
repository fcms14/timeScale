import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MarketHistoryService } from './market-history.service';
import { MarketHistoryController } from './market-history.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [MarketHistoryController],
  providers: [MarketHistoryService, PrismaService]
})
export class MarketHistoryModule {}
