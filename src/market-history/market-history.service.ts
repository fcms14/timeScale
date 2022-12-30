import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MarketHistory, Prisma } from '@prisma/client';
import { Symbol } from '../symbols/entities/symbol.entity';
import { FetchSymbol } from './entities/fetch-symbol.entity';

@Injectable()
export class MarketHistoryService {
  constructor(
    private readonly httpService: HttpService,
    private prisma: PrismaService
  ) { }

  async filterHistory(where: { i_exchange: string, i_ticker: string, i_timeFrame: string, i_start: Date, i_end: Date }): Promise<MarketHistory | any> {
    const table   = ['1m', '4m', '5m', '10m', '15m', '30m', '1h', '2h', '3h', '4h', '6h', '12h', '1d', '1w', '1M'].indexOf(where.i_timeFrame);
    const buckets = [
      'MarketHistory',
      'four_minutes_bars',
      'five_minutes_bars',
      'ten_minutes_bars',
      'fifteen_minutes_bars',
      'thirty_minutes_bars',
      'hourly_bars',
      'two_hours_bars',
      'three_hours_bars',
      'four_hours_bars',
      'six_hours_bars',
      'twelve_hours_bars',
      'daily_bars',
      'weekly_bars',
      'monthly_bars'
    ];
    const column = buckets[table] == 'MarketHistory' ? 'dt' : 'bucket';
    const endAt = where.i_end ? `AND ${column} <= '${where.i_end}' ` : "";
    const sql = `
      SELECT 
        "symbolId", ${column} as dt, open, high, low, close, volume 
      FROM tsdb."${buckets[table]}" as t
      INNER JOIN tsdb."Symbol"   as s ON t."symbolId" = s.id
      INNER JOIN tsdb."Exchange" as e ON s."exchangeId" = e.id
      WHERE ${column} >= '${where.i_start}'
      ${endAt}
      AND   s.ticker   = '${where.i_ticker}'
      AND   e.name     = '${where.i_exchange}'
      ORDER BY ${column} ASC;
    `;

    try { return await this.prisma.$queryRawUnsafe(sql); }
    catch (error) { return { error: error }; }
  }

  async fetchOHLCV(symbol: Symbol): Promise<MarketHistory | any> {
    const htmlEncode = symbol.ticker.replace('/', '%2F');
    const url = `https://ccxt-swagger.up.railway.app/market-history/${symbol.exchange.name}/${htmlEncode}/1m?i_since=${symbol.lastSync.getTime()}&i_limit=${symbol.exchange.limit}`;
    try {
      const response = await this.httpService.axiosRef.get(url);
      const data = response.data;

      let createMany = [];
      for (let line of data) {
        createMany = [
          ...createMany,
          {
            symbolId: symbol.id,
            dt: line[0],
            open: line[2],
            high: line[3],
            low: line[4],
            close: line[5],
            volume: line[6]
          }
        ]
      }

      return createMany;
    }
    catch (error) { return { error: error }; }
  }

  async fetchSymbol(symbol: Symbol): Promise<FetchSymbol | any> {
    try {
      const response = await this.fetchOHLCV(symbol);
      if (response.error) return { error: response }

      const update = response.pop();
      const created = await this.prisma.marketHistory.createMany({ data: response, skipDuplicates: true });
      const updatedSymbol = await this.prisma.symbol.update({ data: { lastSync: update.dt }, where: { id: update.symbolId }, include: { exchange: true } });

      console.log(`${new Date()} -  ${updatedSymbol.lastSync} - Rows: ${created.count} -> ${symbol.exchange.name} / ${symbol.ticker}`);

      return { created: created.count, lastSync: updatedSymbol.lastSync, dateNow: new Date() };
    }
    catch (error) { return { error: error }; }
  }
}
