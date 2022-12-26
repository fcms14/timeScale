import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import { Symbol as Entity } from '../symbols/entities/symbol.entity';


@Injectable()
export class SymbolsService {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.SymbolCreateInput): Promise<Entity | any> {
    try { return await this.prisma.symbol.create({ data, include: { exchange: true } }); }
    catch (error) { return { error: error }; }
  }

  async findAll(): Promise<Entity[]> {
    return this.prisma.symbol.findMany({ include: { exchange: true } });
  }

  async findOne(where: Prisma.SymbolWhereInput): Promise<Entity | any> {
    try { return await this.prisma.symbol.findFirstOrThrow({ where, include: { exchange: true } }); }
    catch (error) { return { error: error }; }
  }

  async findByTickerAndExchange(where: { ticker: string, exchange: { name: string } }): Promise<Entity | any> {
    try { return await this.prisma.symbol.findFirstOrThrow({ include: { exchange: true }, where }); }
    catch (error) { return { error: error }; }
  }

  async update(params: { where: Prisma.SymbolWhereUniqueInput, data: Prisma.SymbolUpdateInput }): Promise<Entity | any> {
    const { data, where } = params;
    try { return await this.prisma.symbol.update({ data, where, include: { exchange: true } }); }
    catch (error) { return { error: error }; }
  }

  async remove(where: Prisma.SymbolWhereUniqueInput): Promise<Entity | any> {
    try { return await this.prisma.symbol.delete({ where, include: { exchange: true } }); }
    catch (error) { return { error: error }; }
  }
}
