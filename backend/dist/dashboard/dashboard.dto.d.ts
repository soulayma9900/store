export declare class DashboardStatsDto {
    totalProducts: number;
    totalCategories: number;
    totalSales: number;
    totalRevenue: number;
    avgPrice: number;
    topProduct: {
        id: string;
        name: string;
        revenue: number;
    };
}
export declare class CategoryCountDto {
    category: string;
    count: number;
}
export declare class SalesPerProductDto {
    product: string;
    revenue: number;
    quantity: number;
}
export declare class DashboardChartsDto {
    productsPerCategory: CategoryCountDto[];
    salesPerProduct: SalesPerProductDto[];
}
export declare class PaginatedProductsDto {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    content: unknown[];
}
export declare class PaginatedSalesDto {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    content: unknown[];
}
export declare class DashboardTablesDto {
    products: PaginatedProductsDto;
    recentSales: PaginatedSalesDto;
}
export declare class DashboardResponseDto {
    stats: DashboardStatsDto;
    charts: DashboardChartsDto;
    tables: DashboardTablesDto;
}
