import { Document } from "mongoose";
export declare class Sale extends Document {
    productId: string;
    quantity: number;
    unitPrice: number;
    saleDate: Date;
    note?: string | null;
    performedBy?: string | null;
    createdAt?: Date | null;
}
export declare const SaleSchema: import("mongoose").Schema<Sale, import("mongoose").Model<Sale, any, any, any, Document<unknown, any, Sale, any, {}> & Sale & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Sale, Document<unknown, {}, import("mongoose").FlatRecord<Sale>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Sale> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
