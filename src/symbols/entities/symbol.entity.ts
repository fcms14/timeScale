import { Exchange as Parent } from "../../exchanges/entities/exchange.entity";

export class Symbol {
    id: number;
    ticker: string;
    name: string;
    lastSync: Date;
    exchangeId: number;
    exchange: Parent;
}
