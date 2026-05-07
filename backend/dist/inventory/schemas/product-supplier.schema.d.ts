import { Document } from 'mongoose';
export declare class ProductSupplier extends Document {
    productId: string;
    supplierId: string;
    negotiatedPrice?: number | null;
    note?: string | null;
    updatedAt?: Date | null;
}
export declare const ProductSupplierSchema: import("mongoose").Schema<ProductSupplier, import("mongoose").Model<ProductSupplier, any, any, any, Document<unknown, any, ProductSupplier, any, {}> & ProductSupplier & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ProductSupplier, Document<unknown, {}, import("mongoose").FlatRecord<ProductSupplier>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ProductSupplier> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
