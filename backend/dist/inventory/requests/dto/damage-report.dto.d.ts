import { StockMovementReason } from '../../enums/stock-movement-reason.enum';
export declare class DamageReportDto {
    productId: string;
    batchId: string;
    quantity: number;
    reason: StockMovementReason;
    note?: string | null;
    draft?: boolean;
}
