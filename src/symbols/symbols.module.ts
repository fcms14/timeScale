import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SymbolsService } from './symbols.service';
import { SymbolsController } from './symbols.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [HttpModule],
  controllers: [SymbolsController],
  providers: [SymbolsService, PrismaService]
})
export class SymbolsModule {}
