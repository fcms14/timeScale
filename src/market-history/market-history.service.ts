import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CreateMarketHistoryDto } from './dto/create-market-history.dto';
import { UpdateMarketHistoryDto } from './dto/update-market-history.dto';

@Injectable()
export class MarketHistoryService {
  constructor(private readonly httpService: HttpService) {}

  create(createMarketHistoryDto: CreateMarketHistoryDto) {
    return 'This action adds a new marketHistory';
  }

  async findAll() {
    const url = 'https://ccxt-swagger.up.railway.app/market-history/bitmex/xbtusd/1m?i_limit=1';
    const response = await this.httpService.axiosRef.get(url);
    return response.data;
  }

  findOne(id: number) {
    return `This action returns a #${id} marketHistory`;
  }

  update(id: number, updateMarketHistoryDto: UpdateMarketHistoryDto) {
    return `This action updates a #${id} marketHistory`;
  }

  remove(id: number) {
    return `This action removes a #${id} marketHistory`;
  }
}
