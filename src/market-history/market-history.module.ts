import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MarketHistoryService } from './market-history.service';
import { MarketHistoryController } from './market-history.controller';

@Module({
  imports: [HttpModule],
  controllers: [MarketHistoryController],
  providers: [MarketHistoryService]
})
export class MarketHistoryModule {}
