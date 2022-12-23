import { Prisma } from '@prisma/client';

export class CreateSymbolDto {
    /**
     * The Symbol Ticker
     * @example 'XBTUSD'
     */
    ticker: string;

    /**
     * The Symbol Name
     * @example 'Bitcoin USD'
     */
    name: string;

    /**
     * Timestamp of the last syncronization
     * @example '2009-12-01T00:00:00.123Z'
     */
    lastSync: Date;

    /**
     * The Exchange Id
     * @example 1
     */
    exchange: Prisma.ExchangeCreateNestedOneWithoutSymbolInput;
}
