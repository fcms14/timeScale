export class CreateExchangeDto {
    /**
     * The Exchange Name
     * @example 'BITMEX'
     */
    name: string;

    /**
     * The Exchange Limit Rows Request
     * @example 1000
     */
    limit: number;
}
