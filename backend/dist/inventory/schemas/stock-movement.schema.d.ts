import { Document } from 'mongoose';
import { StockMovementReason } from '../enums/stock-movement-reason.enum';
export declare class StockMovement extends Document {
    productId: string;
    delta: number;
    reason: StockMovementReason;
    batchId?: string | null;
    supplierId?: string | null;
    unitCost?: number | null;
    note?: string | null;
    performedBy?: string | null;
    createdAt?: Date | null;
}
export declare const StockMovementSchema: import("mongoose").Schema<StockMovement, import("mongoose").Model<StockMovement, any, any, any, Document<unknown, any, StockMovement, any, {}> & StockMovement & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, StockMovement, Document<unknown, {}, import("mongoose").FlatRecord<StockMovement>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<StockMovement> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
