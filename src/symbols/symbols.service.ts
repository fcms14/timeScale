import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Symbol, Prisma } from '@prisma/client';


@Injectable()
export class SymbolsService {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.SymbolCreateInput): Promise<Symbol | any> {
    try { return await this.prisma.symbol.create({ data, include: { exchange: true } }); }
    catch (error) { return { error: error }; }
  }

  async findAll(): Promise<Symbol[]> {
    return this.prisma.symbol.findMany({ include: { exchange: true } });
  }

  async findOne(where: Prisma.SymbolWhereInput): Promise<Symbol | any> {
    try { return await this.prisma.symbol.findFirstOrThrow({ where, include: { exchange: true } }); }
    catch (error) { return { error: error }; }
  }

  async update(params: { where: Prisma.SymbolWhereUniqueInput, data: Prisma.SymbolUpdateInput }): Promise<Symbol | any> {
    const { data, where } = params;
    try { return await this.prisma.symbol.update({ data, where, include: { exchange: true } }); }
    catch (error) { return { error: error }; }
  }

  async remove(where: Prisma.SymbolWhereUniqueInput): Promise<Symbol | any> {
    try { return await this.prisma.symbol.delete({ where, include: { exchange: true } }); }
    catch (error) { return { error: error }; }
  }
}
