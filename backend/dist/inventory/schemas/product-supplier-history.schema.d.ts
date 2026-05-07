import { Document } from 'mongoose';
export declare class ProductSupplierHistory extends Document {
    productId: string;
    supplierId: string;
    negotiatedPrice?: number | null;
    note?: string | null;
    updatedBy?: string | null;
    effectiveAt?: Date | null;
}
export declare const ProductSupplierHistorySchema: import("mongoose").Schema<ProductSupplierHistory, import("mongoose").Model<ProductSupplierHistory, any, any, any, Document<unknown, any, ProductSupplierHistory, any, {}> & ProductSupplierHistory & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ProductSupplierHistory, Document<unknown, {}, import("mongoose").FlatRecord<ProductSupplierHistory>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ProductSupplierHistory> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
