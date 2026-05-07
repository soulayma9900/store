import { ProductSuppliersService } from './product-suppliers.service';
import { ProductSupplierRequestDto } from './dto/product-supplier-request.dto';
import { ProductSupplierResponseDto } from './dto/product-supplier-response.dto';
import { ProductSupplierHistoryResponseDto } from './dto/product-supplier-history-response.dto';
export declare class ProductSuppliersController {
    private readonly productSuppliersService;
    constructor(productSuppliersService: ProductSuppliersService);
    upsert(productId: string, request: ProductSupplierRequestDto, req: {
        user?: {
            username?: string;
        };
    }): Promise<ProductSupplierResponseDto>;
    getSuppliers(productId: string): Promise<ProductSupplierResponseDto[]>;
    getHistory(productId: string): Promise<ProductSupplierHistoryResponseDto[]>;
    getProductsForSupplier(supplierId: string): Promise<ProductSupplierResponseDto[]>;
}
