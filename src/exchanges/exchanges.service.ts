import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Exchange, Prisma } from '@prisma/client';

@Injectable()
export class ExchangesService {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.ExchangeCreateInput): Promise<Exchange | any> {
    try { return await this.prisma.exchange.create({ data }); }
    catch (error) { return { error: error }; }
  }

  async findAll(): Promise<Exchange[]> {
    return this.prisma.exchange.findMany();
  }

  async findOne(where: Prisma.ExchangeWhereUniqueInput): Promise<Exchange | any> {
    try { return await this.prisma.exchange.findUniqueOrThrow({ where }); }
    catch (error) { return { error: error }; }
  }

  async update(params: { where: Prisma.ExchangeWhereUniqueInput, data: Prisma.ExchangeUpdateInput }): Promise<Exchange | any> {
    const { data, where } = params;
    try { return await this.prisma.exchange.update({ data, where }); }
    catch (error) { return { error: error }; }
  }

  async remove(where: Prisma.ExchangeWhereUniqueInput): Promise<Exchange | any> {
    try { return await this.prisma.exchange.delete({ where }); }
    catch (error) { return { error: error }; }
  }
}
