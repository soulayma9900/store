import { Model } from "mongoose";
import { DashboardResponseDto } from "./dashboard.dto";
import { Product } from "../inventory/schemas/product.schema";
import { Sale } from "../inventory/schemas/sale.schema";
import { Category } from "../inventory/schemas/category.schema";
export declare class DashboardService {
    private readonly productModel;
    private readonly saleModel;
    private readonly categoryModel;
    constructor(productModel: Model<Product>, saleModel: Model<Sale>, categoryModel: Model<Category>);
    getDashboard(): Promise<DashboardResponseDto>;
    private getStats;
    private getCharts;
    private getProductsPerCategory;
    private getSalesPerProduct;
    private getTables;
    private getProductsTable;
    private getRecentSalesTable;
}
