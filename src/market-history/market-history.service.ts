import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MarketHistory, Prisma } from '@prisma/client';
import { Symbol } from '../symbols/entities/symbol.entity';

@Injectable()
export class MarketHistoryService {
  constructor(
    private readonly httpService: HttpService,
    private prisma: PrismaService
  ) { }

  async filterHistory(filter: { dt: { gte: Date, lte: Date | null }, symbol: { ticker: string, exchange: { name: string } } }) {
    let where = {};
    if (!filter.dt.lte) {
      where = { dt: { gte: new Date(filter.dt.gte) }, symbol: { ticker: filter.symbol.ticker, exchange: { name: filter.symbol.exchange.name } } }
    }
    else {
      where = { dt: { gte: new Date(filter.dt.gte), lte: new Date(filter.dt.lte) }, symbol: { ticker: filter.symbol.ticker, exchange: { name: filter.symbol.exchange.name } } }
    }

    try {
      return await this.prisma.marketHistory.findMany({
        // include: { symbol: { include: { exchange: true } } },
        where,
        orderBy: {
          dt: 'asc'
        },
      });
    }
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

  async fetchSymbol(symbol: Symbol): Promise<MarketHistory | any> {
    try {
      const response = await this.fetchOHLCV(symbol);
      if (response.error) return { error: response }

      const update = response.pop();
      const rowsInserted = await this.prisma.marketHistory.createMany({ data: response, skipDuplicates: true });
      const updatedSymbol = await this.prisma.symbol.update({ data: { lastSync: update.dt }, where: { id: update.symbolId }, include: { exchange: true } });

      console.log(`${new Date()} -  ${updatedSymbol.lastSync} - Rows: ${rowsInserted.count} -> ${symbol.exchange.name} / ${symbol.ticker}`);

      if ((new Date().getTime() - updatedSymbol.lastSync.getTime()) > 10800000) {
        await this.fetchSymbol(updatedSymbol);
      }

      return { rowsInserted: rowsInserted.count, lastSync: updatedSymbol.lastSync, dateNow: new Date() };
    }
    catch (error) { return { error: error }; }
  }
}
