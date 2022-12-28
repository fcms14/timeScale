import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SymbolsService } from 'src/symbols/symbols.service';
import { MarketHistoryService } from './market-history.service';
import { CreateMarketHistoryDto } from './dto/create-market-history.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { MarketHistory as Entity } from './entities/market-history.entity';
import { FetchSymbol } from './entities/fetch-symbol.entity';
import { Cron, CronExpression, Interval } from '@nestjs/schedule';

@ApiTags('marketHistory')
@Controller('market-history')
export class MarketHistoryController {
  constructor(
    private readonly marketHistoryService: MarketHistoryService,
    private readonly symbolsService: SymbolsService
  ) { }

  @Get('fetch-symbol/:exchange/:ticker')
  @ApiOkResponse({ description: 'Market history from given exchange and symbol ticker', type: FetchSymbol, isArray: false })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No content' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflicted' })
  async fetchSymbol(
    @Param('exchange') name: string,
    @Param('ticker') ticker: string
  ) {
    const symbol = await this.symbolsService.findByTickerAndExchange({ ticker, exchange: { name } });
    if (symbol.error) throw new HttpException({ status: HttpStatus.NOT_FOUND, name: 'Symbol not found', message: symbol.error }, HttpStatus.NOT_FOUND);
    const created = await this.marketHistoryService.fetchSymbol(symbol);
    if (created.error) throw new HttpException({ status: HttpStatus.CONFLICT, message: created.error }, HttpStatus.CONFLICT);

    return created;
  }

  @ApiParam({
    name: 'i_exchange',
    example: 'BITMEX',
    description: `Required to filter data form exchange`,
    type: String
  })
  @ApiParam({
    name: 'i_ticker',
    example: 'XBTUSD',
    description: `Required to filter data from ticker`,
    type: String
  })
  @ApiParam({
    name: 'i_start',
    example: '2022-12-27 15:00:00',
    description: `Required to filter the period starting at`,
    type: Date
  })
  @ApiQuery({
    name: 'i_end',
    example: '2022-12-27 16:00:00',
    description: `Optional to filter the period ending at`,
    required: false,
    type: Date
  })
  @Get(':i_exchange/:i_ticker/:i_timeFrame/:i_start')
  @ApiOkResponse({ description: 'Market History', type: Entity, isArray: true })
  @ApiResponse({ status: 404, description: 'Not Found.' })
  async filterHistory(
    @Param('i_exchange') i_exchange: string,
    @Param('i_ticker') i_ticker: string,
    // @Param('i_timeFrame') i_timeFrame: string,
    @Param('i_start') i_start: Date,
    @Query('i_end') i_end?: Date | null
  ) {
    const period = await this.marketHistoryService.filterHistory({ dt: { gte: i_start, lte: i_end }, symbol: { ticker: i_ticker, exchange: { name: i_exchange } } });
    return period;
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleInterval() {
    const symbols = await this.symbolsService.findAll();
    if (symbols.error) return console.log('try again in 1 minute');

    for (let symbol of symbols) {
      if ((new Date().getTime() - symbol.lastSync.getTime()) > 10800000) {
        console.log(symbol, "Ignored. Manual sync required.");
        continue;
      }

      if (new Date().getTime() + 130000 > symbol.lastSync.getTime()) {
        const created = await this.marketHistoryService.fetchSymbol(symbol);
        if (created.error) console.log(created.error);
        console.log(symbol.exchange.name, created);
      }
    }
  }
}
