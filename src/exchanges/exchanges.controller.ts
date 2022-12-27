import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExchangesService } from './exchanges.service';
import { CreateExchangeDto } from './dto/create-exchange.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { ParseIntPipe } from '@nestjs/common/pipes';
import { Exchange as Entity } from './entities/exchange.entity';

@ApiTags('exchanges')
@Controller('exchanges')
export class ExchangesController {
  constructor(private readonly exchangesService: ExchangesService) { }

  @Post()
  @ApiCreatedResponse({ description: 'A created exchange', type: Entity, isArray: false })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Conflicted' })
  async create(@Body() createExchangeDto: CreateExchangeDto) {
    const exchange = await this.exchangesService.create(createExchangeDto);
    if (exchange.error) throw new HttpException({ status: HttpStatus.CONFLICT, message: exchange.error }, HttpStatus.CONFLICT);
    return exchange;
  }

  @Get('/fetch')
  @ApiOkResponse({ description: 'List of supported exchanges', type: Array, isArray: true })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'No content' })
  async fetchExchanges() {
    const exchanges = await this.exchangesService.fetchExchanges();
    if (exchanges.error) throw new HttpException({ status: HttpStatus.NO_CONTENT, message: exchanges.error }, HttpStatus.NO_CONTENT);
    return exchanges;
  }

  @Get()
  @ApiOkResponse({ description: 'A list of exchanges', type: Entity, isArray: true })
  findAll() {
    return this.exchangesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'A selected exchange', type: Entity, isArray: false })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'No content' })
  async findOneById(@Param('id', ParseIntPipe) id: number) {
    const exchange = await this.exchangesService.findOne({ id });
    if (exchange.error) throw new HttpException({ status: HttpStatus.NO_CONTENT, message: exchange.error }, HttpStatus.NO_CONTENT);
    return exchange;
  }

  @Get('name/:name')
  @ApiOkResponse({ description: 'A selected exchange', type: Entity, isArray: false })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'No content' })
  async findOneByName(@Param('name') name: string) {
    const exchange = await this.exchangesService.findOne({ name });
    if (exchange.error) throw new HttpException({ status: HttpStatus.NO_CONTENT, message: exchange.error }, HttpStatus.NO_CONTENT);
    return exchange;
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'An updated exchange', type: Entity, isArray: false })
  @ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: 'Not acceptable' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateExchangeDto: CreateExchangeDto) {
    const exchange = await this.exchangesService.update({ where: { id }, data: updateExchangeDto });
    if (exchange.error) throw new HttpException({ status: HttpStatus.NOT_ACCEPTABLE, message: exchange.error }, HttpStatus.NOT_ACCEPTABLE);
    return exchange;
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'A deleted exchange', type: Entity, isArray: false })
  @ApiResponse({ status: HttpStatus.NOT_ACCEPTABLE, description: 'Not acceptable' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const exchange = await this.exchangesService.remove({ id });
    if (exchange.error) throw new HttpException({ status: HttpStatus.NOT_ACCEPTABLE, message: exchange.error }, HttpStatus.NOT_ACCEPTABLE);
    return exchange;
  }
}
