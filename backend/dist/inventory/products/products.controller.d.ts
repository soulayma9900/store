import { ProductsService } from "./products.service";
import { ProductCreateDto } from "./dto/product-create.dto";
import { ProductUpdateDto } from "./dto/product-update.dto";
import { ProductResponseDto } from "./dto/product-response.dto";
import { ProductBulkCategoryDto } from "./dto/product-bulk-category.dto";
import { ProductBulkPriceDto } from "./dto/product-bulk-price.dto";
import { StockReceiveDto } from "./dto/stock-receive.dto";
import { StockWasteDto } from "./dto/stock-waste.dto";
import { StockAdjustDto } from "./dto/stock-adjust.dto";
import { ProductImportResultDto } from "./dto/product-import-result.dto";
import { BatchResponseDto } from "./dto/batch-response.dto";
import { StockMovementResponseDto } from "./dto/stock-movement-response.dto";
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(request: ProductCreateDto): Promise<ProductResponseDto>;
    update(id: string, request: ProductUpdateDto): Promise<ProductResponseDto>;
    delete(id: string): Promise<void>;
    getById(id: string): Promise<ProductResponseDto>;
    getByBarcode(barcode: string): Promise<ProductResponseDto>;
    receiveStock(id: string, request: StockReceiveDto, req: {
        user?: {
            username?: string;
        };
    }): Promise<ProductResponseDto>;
    wasteStock(id: string, request: StockWasteDto, req: {
        user?: {
            username?: string;
        };
    }): Promise<ProductResponseDto>;
    adjustStock(id: string, request: StockAdjustDto, req: {
        user?: {
            username?: string;
        };
    }): Promise<ProductResponseDto>;
    getMovements(id: string, page?: string, size?: string): Promise<{
        content: StockMovementResponseDto[];
        totalElements: number;
        totalPages: number;
        number: number;
        size: number;
    }>;
    getBatches(id: string, availableOnly?: string): Promise<BatchResponseDto[]>;
    getAll(page?: string, size?: string, sortBy?: string, sortDir?: string, name?: string, categoryId?: string, supplierId?: string): Promise<{
        content: ProductResponseDto[];
        totalElements: number;
        totalPages: number;
        number: number;
        size: number;
    }>;
    getLowStockAlerts(): Promise<ProductResponseDto[]>;
    getReorderList(): Promise<import("./dto/product-reorder-response.dto").ProductReorderResponseDto[]>;
    snoozeLowStock(id: string, days?: string): Promise<void>;
    bulkUpdateCategory(request: ProductBulkCategoryDto): Promise<void>;
    bulkUpdatePrice(request: ProductBulkPriceDto): Promise<void>;
    importCsv(file: Express.Multer.File): Promise<ProductImportResultDto>;
}
