import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MarketHistoryService } from './market-history.service';
import { CreateMarketHistoryDto } from './dto/create-market-history.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { MarketHistory as Entity } from './entities/market-history.entity';

@ApiTags('marketHistory')
@Controller('market-history')
export class MarketHistoryController {
  constructor(private readonly marketHistoryService: MarketHistoryService) { }

  // @Post()
  // create(@Body() createMarketHistoryDto: CreateMarketHistoryDto) {
  //   console.log(createMarketHistoryDto);
  //   return createMarketHistoryDto;
  //   // return this.marketHistoryService.create(createMarketHistoryDto);
  // }

  // @Get()
  // findAll() {
  //   return this.marketHistoryService.fetchAll();
  // }

  @Get(':exchange/:ticker')
  @ApiOkResponse({ description: 'Market history from given exchange and symbol ticker', type: Entity, isArray: false })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No content' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflicted' })
  async findOneByTicker(
    @Param('exchange') name: string,
    @Param('ticker') ticker: string
  ) {
    const symbol = await this.marketHistoryService.findTicker({ ticker, exchange: { name } });
    if (symbol.error) throw new HttpException({ status: HttpStatus.NOT_FOUND, name: 'SYMBOL NOT FOUND', message: symbol.error }, HttpStatus.NOT_FOUND);
    const response = await this.marketHistoryService.fetchAll(symbol.exchange.name, symbol.ticker, symbol.lastSync);
    if (response.error) throw new HttpException({ status: HttpStatus.NOT_FOUND, name: 'DATA NOT FOUND', message: response.error }, HttpStatus.NOT_FOUND);
    const created = await this.marketHistoryService.create(symbol, response.data);
    if (created.error) throw new HttpException({ status: HttpStatus.CONFLICT, message: created.error }, HttpStatus.CONFLICT);

    return created;
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMarketHistoryDto: UpdateMarketHistoryDto) {
  //   return this.marketHistoryService.update(+id, updateMarketHistoryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.marketHistoryService.remove(+id);
  // }
}
