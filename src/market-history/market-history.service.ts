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

  async fetchAll(exchange: string, ticker: string, since: Date): Promise<MarketHistory | any> {
    const htmlEncode = ticker.replace('/', '%2F');
    const url = `https://ccxt-swagger.up.railway.app/market-history/${exchange}/${htmlEncode}/1m?i_since=${since.getTime()}&i_limit=1000`;
    try { return await this.httpService.axiosRef.get(url); }
    catch (error) { return { error: error }; }
  }

  async create(symbol: Symbol, lastSync: Date): Promise<MarketHistory | any> {
    try {
      const response = await this.fetchAll(symbol.exchange.name, symbol.ticker, lastSync);

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

      const rowsInserted = await this.prisma.marketHistory.createMany({ data: createMany, skipDuplicates: true });

      const update = createMany.pop();
      update.dt = new Date(new Date(update.dt).setMinutes(new Date(update.dt).getMinutes() + 1));
      console.log(new Date() + " - " + update.dt + " - Rows: " + rowsInserted.count);

      await this.prisma.symbol.update({ data: { lastSync: update.dt }, where: { id: update.symbolId } });

      if (new Date().getTime() - 90000 > update.dt.getTime()) {
        await this.create(symbol, update.dt);
      }

      return { rowsInserted: rowsInserted.count, lastSync: update.dt, dateNow: new Date() };
    }
    catch (error) {
      console.log(error);
      return { error: error };
    }
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
