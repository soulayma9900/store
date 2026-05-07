import { Document } from 'mongoose';
export declare class InventoryBatch extends Document {
    productId: string;
    supplierId: string;
    lotNumber?: string | null;
    expiryDate?: Date | null;
    unitCost?: number | null;
    quantityReceived?: number | null;
    quantityRemaining?: number | null;
    receivedAt?: Date | null;
    note?: string | null;
    createdBy?: string | null;
}
export declare const InventoryBatchSchema: import("mongoose").Schema<InventoryBatch, import("mongoose").Model<InventoryBatch, any, any, any, Document<unknown, any, InventoryBatch, any, {}> & InventoryBatch & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, InventoryBatch, Document<unknown, {}, import("mongoose").FlatRecord<InventoryBatch>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<InventoryBatch> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
