import { Model } from "mongoose";
import { Sale } from "../schemas/sale.schema";
import { Product } from "../schemas/product.schema";
import { StockMovement } from "../schemas/stock-movement.schema";
import { SaleCreateDto } from "./dto/sale-create.dto";
import { SaleResponseDto } from "./dto/sale-response.dto";
interface PageResult<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}
export declare class SalesService {
    private readonly saleModel;
    private readonly productModel;
    private readonly stockMovementModel;
    constructor(saleModel: Model<Sale>, productModel: Model<Product>, stockMovementModel: Model<StockMovement>);
    create(request: SaleCreateDto, performedBy: string): Promise<SaleResponseDto>;
    getAll(page?: number, size?: number, productId?: string): Promise<PageResult<SaleResponseDto>>;
    private toResponse;
}
export {};
