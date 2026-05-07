import { StockMovementReason } from "../../enums/stock-movement-reason.enum";
export declare class StockAdjustDto {
    quantity: number;
    reason: StockMovementReason;
    increase: boolean;
    note?: string | null;
}
