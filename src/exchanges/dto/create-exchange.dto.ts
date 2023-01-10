export class CreateExchangeDto {
    /**
     * The Exchange Name
     * @example 'bitmex'
     */
    name: string;

    /**
     * The Exchange Limit Rows Request
     * @example 1000
     */
    limit: number;
}
