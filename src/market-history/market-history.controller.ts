import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MarketHistoryService } from './market-history.service';
import { CreateMarketHistoryDto } from './dto/create-market-history.dto';
import { UpdateMarketHistoryDto } from './dto/update-market-history.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('marketHistory')
@Controller('market-history')
export class MarketHistoryController {
  constructor(private readonly marketHistoryService: MarketHistoryService) {}

  @Post()
  create(@Body() createMarketHistoryDto: CreateMarketHistoryDto) {
    return this.marketHistoryService.create(createMarketHistoryDto);
  }

  @Get()
  findAll() {
    return this.marketHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.marketHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMarketHistoryDto: UpdateMarketHistoryDto) {
    return this.marketHistoryService.update(+id, updateMarketHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.marketHistoryService.remove(+id);
  }
}
