import { Unit } from "../../enums/unit.enum";
export declare class ProductCreateDto {
    name: string;
    barcode?: string | null;
    categoryId: string;
    primarySupplierId: string;
    price: number;
    unit: Unit;
    imageUrl?: string | null;
    notes?: string | null;
    lowStockThreshold: number;
}
