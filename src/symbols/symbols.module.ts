import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SymbolsService } from './symbols.service';
import { SymbolsController } from './symbols.controller';
import { PrismaService } from 'src/prisma.service';
import { ExchangesService } from 'src/exchanges/exchanges.service';

@Module({
  imports: [HttpModule],
  controllers: [SymbolsController],
  providers: [SymbolsService, ExchangesService, PrismaService]
})
export class SymbolsModule {}
