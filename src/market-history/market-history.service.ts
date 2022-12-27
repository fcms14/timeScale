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

  async fetchAll(symbol: Symbol): Promise<MarketHistory | any> {
    const htmlEncode = symbol.ticker.replace('/', '%2F');
    const url = `https://ccxt-swagger.up.railway.app/market-history/${symbol.exchange.name}/${htmlEncode}/1m?i_since=${symbol.lastSync.getTime()}&i_limit=${symbol.exchange.limit}`;
    try { return await this.httpService.axiosRef.get(url); }
    catch (error) { return { error: error }; }
  }

  async create(symbol: Symbol): Promise<MarketHistory | any> {
    try {
      const response = await this.fetchAll(symbol);

      if (response.error) return { error: response }
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

      const update = createMany.pop();
      // update.dt = new Date(update.dt); // new Date(new Date(update.dt).setMinutes(new Date(update.dt).getMinutes() + 1));

      const rowsInserted  = await this.prisma.marketHistory.createMany({ data: createMany, skipDuplicates: true });
      const updatedSymbol = await this.prisma.symbol.update({ data: { lastSync: update.dt }, where: { id: update.symbolId }, include: { exchange: true } });

      console.log(`${new Date()} -  ${updatedSymbol.lastSync} - Rows: ${rowsInserted.count} -> ${symbol.exchange.name} / ${symbol.ticker}`);

      if ((new Date().getTime() - updatedSymbol.lastSync.getTime()) > 10800000) {
        await this.create(updatedSymbol);
      }

      return { rowsInserted: rowsInserted.count, lastSync: updatedSymbol.lastSync, dateNow: new Date() };
    }
    catch (error) { return { error: error }; }
  }

  // async findAll(): Promise<MarketHistory[]> {
  //   return this.prisma.marketHistory.findMany();
  // }

  // async findOne(where: Prisma.MarketHistoryWhereInput): Promise<MarketHistory | any> {
  //   try { return await this.prisma.marketHistory.findFirstOrThrow({ where }); }
  //   catch (error) { return { error: error }; }
  // }

  // async update(params: { where: Prisma.MarketHistoryWhereUniqueInput, data: Prisma.MarketHistoryUpdateInput }): Promise<MarketHistory | any> {
  //   const { data, where } = params;
  //   try { return await this.prisma.marketHistory.update({ data, where }); }
  //   catch (error) { return { error: error }; }
  // }

  // async remove(where: Prisma.MarketHistoryWhereUniqueInput): Promise<MarketHistory | any> {
  //   try { return await this.prisma.marketHistory.delete({ where }); }
  //   catch (error) { return { error: error }; }
  // }
}
