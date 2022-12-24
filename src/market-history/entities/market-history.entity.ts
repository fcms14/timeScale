import { Symbol as Parent } from "../../symbols/entities/symbol.entity";

export class MarketHistory {
    symbolId: number;
    symbol: Parent;
    dt: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}
