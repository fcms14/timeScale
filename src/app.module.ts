import { Module } from '@nestjs/common';
import { MarketHistoryModule } from './market-history/market-history.module';
import { ExchangesModule } from './exchanges/exchanges.module';
import { SymbolsModule } from './symbols/symbols.module';

@Module({
  imports: [MarketHistoryModule, ExchangesModule, SymbolsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
