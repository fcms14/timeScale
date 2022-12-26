import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SymbolsService } from 'src/symbols/symbols.service';
import { MarketHistoryService } from './market-history.service';
import { MarketHistoryController } from './market-history.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [MarketHistoryController],
  providers: [MarketHistoryService, SymbolsService, PrismaService]
})
export class MarketHistoryModule {}
