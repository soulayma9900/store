import { Document } from 'mongoose';
import { Unit } from '../enums/unit.enum';
export declare class Product extends Document {
    name: string;
    barcode?: string | null;
    categoryId: string;
    primarySupplierId: string;
    price: number;
    costPrice?: number | null;
    quantity?: number | null;
    unit: Unit;
    imageUrl?: string | null;
    notes?: string | null;
    lowStockThreshold?: number | null;
    lowStockSnoozedUntil?: Date | null;
}
export declare const ProductSchema: import("mongoose").Schema<Product, import("mongoose").Model<Product, any, any, any, Document<unknown, any, Product, any, {}> & Product & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Product, Document<unknown, {}, import("mongoose").FlatRecord<Product>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Product> & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}>;
