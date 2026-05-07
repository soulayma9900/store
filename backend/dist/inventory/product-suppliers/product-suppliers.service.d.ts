import { Model } from 'mongoose';
import { ProductSupplier } from '../schemas/product-supplier.schema';
import { ProductSupplierHistory } from '../schemas/product-supplier-history.schema';
import { ProductSupplierRequestDto } from './dto/product-supplier-request.dto';
import { ProductSupplierResponseDto } from './dto/product-supplier-response.dto';
import { ProductSupplierHistoryResponseDto } from './dto/product-supplier-history-response.dto';
import { Product } from '../schemas/product.schema';
import { Supplier } from '../schemas/supplier.schema';
export declare class ProductSuppliersService {
    private readonly productSupplierModel;
    private readonly historyModel;
    private readonly productModel;
    private readonly supplierModel;
    constructor(productSupplierModel: Model<ProductSupplier>, historyModel: Model<ProductSupplierHistory>, productModel: Model<Product>, supplierModel: Model<Supplier>);
    upsert(productId: string, request: ProductSupplierRequestDto, updatedBy: string): Promise<ProductSupplierResponseDto>;
    getSuppliersForProduct(productId: string): Promise<ProductSupplierResponseDto[]>;
    getHistoryForProduct(productId: string): Promise<ProductSupplierHistoryResponseDto[]>;
    getProductsForSupplier(supplierId: string): Promise<ProductSupplierResponseDto[]>;
    private toResponse;
}
