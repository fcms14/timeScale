import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Symbol, Prisma } from '@prisma/client';


@Injectable()
export class SymbolsService {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.SymbolCreateInput): Promise<Symbol | any> {
    try { return await this.prisma.symbol.create({ data }); }
    catch (error) { return { error: error }; }
  }

  async findAll(): Promise<Symbol[]> {
    return this.prisma.symbol.findMany();
  }

  async findOne(where: Prisma.SymbolWhereInput): Promise<Symbol | any> {
    try { return await this.prisma.symbol.findFirstOrThrow({ where }); }
    catch (error) { return { error: error }; }
  }

  async update(params: { where: Prisma.SymbolWhereUniqueInput, data: Prisma.SymbolUpdateInput }): Promise<Symbol | any> {
    const { data, where } = params;
    try { return await this.prisma.symbol.update({ data, where }); }
    catch (error) { return { error: error }; }
  }

  async remove(where: Prisma.SymbolWhereUniqueInput): Promise<Symbol | any> {
    try { return await this.prisma.symbol.delete({ where }); }
    catch (error) { return { error: error }; }
  }
}
