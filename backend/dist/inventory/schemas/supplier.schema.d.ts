import { Document } from 'mongoose';
export declare class Supplier extends Document {
    name: string;
    phone?: string | null;
    address?: string | null;
    notes?: string | null;
}
export declare const SupplierSchema: import("mongoose").Schema<Supplier, import("mongoose").Model<Supplier, any, any, any, Document<unknown, any, Supplier, any, {}> & Supplier & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Supplier, Document<unknown, {}, import("mongoose").FlatRecord<Supplier>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Supplier> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
