import { StockMovementReason } from "../../enums/stock-movement-reason.enum";
export declare class StockWasteDto {
    batchId: string;
    quantity: number;
    reason: StockMovementReason;
    note?: string | null;
}
