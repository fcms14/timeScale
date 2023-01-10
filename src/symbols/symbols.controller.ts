import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SymbolsService } from './symbols.service';
import { ExchangesService } from 'src/exchanges/exchanges.service';
import { CreateSymbolDto } from './dto/create-symbol.dto';
import { UpdateSymbolDto } from './dto/update-symbol.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { Symbol as Entity } from './entities/symbol.entity';

@ApiTags('symbols')
@Controller('symbols')
export class SymbolsController {
  constructor(
    private readonly symbolsService: SymbolsService,
    private readonly exchangesService: ExchangesService
  ) { }

  @Post()
  @ApiCreatedResponse({ description: 'A created symbol', type: Entity, isArray: false })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflicted' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  async create(@Body() createSymbolDto: CreateSymbolDto) {

    const exchange = await this.exchangesService.findOne({ id: Number(createSymbolDto.exchange) });
    if (exchange.error) throw new HttpException({ status: HttpStatus.NO_CONTENT, message: exchange.error }, HttpStatus.NOT_FOUND);

    const symbols = await this.fetchSymbols(exchange.name);
    if (!symbols.includes(createSymbolDto.ticker)) throw new HttpException({ status: HttpStatus.NOT_FOUND, message: { title: "Symbol not available. Choose one of these:", symbols } }, HttpStatus.NOT_FOUND);

    createSymbolDto.lastSync = new Date(createSymbolDto.lastSync);
    createSymbolDto.exchange = { connect: { id: Number(createSymbolDto.exchange) } };
    const symbol = await this.symbolsService.create(createSymbolDto);
    if (symbol.error) throw new HttpException({ status: HttpStatus.CONFLICT, message: symbol.error }, HttpStatus.CONFLICT);
    return symbol;
  }

  @ApiParam({
    name: "i_exchange",
    description: `Required to list the Tickers Available on Exchanges`,
  })
  @Get('/fetch/:i_exchange')
  @ApiOkResponse({ description: 'List of Tickers Available on Exchanges', type: Array, isArray: true })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'No content' })
  async fetchSymbols(@Param('i_exchange') i_exchange: string) {
    const symbols = await this.symbolsService.fetchSymbols(i_exchange.toLowerCase());
    if (symbols.error) throw new HttpException({ status: HttpStatus.NO_CONTENT, message: symbols.error }, HttpStatus.NO_CONTENT);
    return symbols;
  }

  @Get()
  @ApiOkResponse({ description: 'A list of symbols', type: Entity, isArray: true })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'No content' })
  async findAll() {
    const symbol = await this.symbolsService.findAll();
    if (symbol.error) throw new HttpException({ status: HttpStatus.NO_CONTENT, message: symbol.error }, HttpStatus.NO_CONTENT);
    return symbol;
  }

  @Get(':id')
  @ApiOkResponse({ description: 'A selected symbol', type: Entity, isArray: false })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'No content' })
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    const symbol = await this.symbolsService.findOne({ id });
    if (symbol.error) throw new HttpException({ status: HttpStatus.NO_CONTENT, message: symbol.error }, HttpStatus.NO_CONTENT);
    return symbol;
  }

  @Get('ticker/:ticker')
  @ApiOkResponse({ description: 'A selected symbol', type: Entity, isArray: false })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'No content' })
  async findOneByTicker(@Param('ticker') ticker: string) {
    const symbol = await this.symbolsService.findOne({ ticker });
    if (symbol.error) throw new HttpException({ status: HttpStatus.NO_CONTENT, message: symbol.error }, HttpStatus.NO_CONTENT);
    return symbol;
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'An updated symbol', type: Entity, isArray: false })
  @ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: 'Not acceptable' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateSymbolDto: UpdateSymbolDto) {
    updateSymbolDto.lastSync = new Date(updateSymbolDto.lastSync);
    if (updateSymbolDto.exchange) updateSymbolDto.exchange = { connect: { id: Number(updateSymbolDto.exchange) } };
    const symbol = await this.symbolsService.update({ where: { id }, data: updateSymbolDto });
    if (symbol.error) throw new HttpException({ status: HttpStatus.NOT_ACCEPTABLE, message: symbol.error }, HttpStatus.NOT_ACCEPTABLE);
    return symbol;
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'A deleted symbol', type: Entity, isArray: false })
  @ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: 'Not acceptable' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const symbol = await this.symbolsService.remove({ id });
    if (symbol.error) throw new HttpException({ status: HttpStatus.NOT_ACCEPTABLE, message: symbol.error }, HttpStatus.NOT_ACCEPTABLE);
    return symbol;
  }
}
