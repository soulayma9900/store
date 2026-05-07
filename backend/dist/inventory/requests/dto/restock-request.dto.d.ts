export declare class RestockRequestDto {
    productId: string;
    quantity: number;
    supplierId?: string | null;
    costPrice?: number | null;
    lotNumber?: string | null;
    expiryDate?: string | null;
    note?: string | null;
    draft?: boolean;
}
