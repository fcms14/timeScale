import { Prisma } from '@prisma/client';

export class CreateMarketHistoryDto {
    /**
     * The Symbol Id
     * @example 1
     */
    symbol: Prisma.SymbolCreateNestedOneWithoutMarketHistoryInput;

    // /**
    //  * Timestamp of the market values
    //  * @example '2009-12-01T00:00:00.000Z'
    //  */
    // dt: Date;

    // /**
    //  * Open value at the moment
    //  * @example 6760.5
    //  */
    // open: number;

    // /**
    //  * High value at the moment
    //  * @example 6775
    //  */
    // high: number;

    // /**
    //  * Low value at the moment
    //  * @example 6750.5
    //  */
    // low: number;

    // /**
    //  * Close value at the moment
    //  * @example 6769.5
    //  */
    // close: number;

    // /**
    //  * Volume traded at the moment
    //  * @example 3312175
    //  */
    // volume: number;
}
