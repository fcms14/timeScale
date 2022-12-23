import { Module } from '@nestjs/common';
import { SymbolsService } from './symbols.service';
import { SymbolsController } from './symbols.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SymbolsController],
  providers: [SymbolsService, PrismaService]
})
export class SymbolsModule {}
