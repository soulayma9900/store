"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardResponseDto = exports.DashboardTablesDto = exports.PaginatedSalesDto = exports.PaginatedProductsDto = exports.DashboardChartsDto = exports.SalesPerProductDto = exports.CategoryCountDto = exports.DashboardStatsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class DashboardStatsDto {
    totalProducts;
    totalCategories;
    totalSales;
    totalRevenue;
    avgPrice;
    topProduct;
}
exports.DashboardStatsDto = DashboardStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 145, type: Number }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "totalProducts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12, type: Number }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "totalCategories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 523, type: Number }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "totalSales", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5234.75, type: Number }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "totalRevenue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25.5, type: Number }),
    __metadata("design:type", Number)
], DashboardStatsDto.prototype, "avgPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: "object",
        example: {
            id: "65f1c2d3a4b5c6d7e8f90123",
            name: "Premium Coffee",
            revenue: 1250.5,
        },
        properties: {
            id: { type: "string" },
            name: { type: "string" },
            revenue: { type: "number" },
        },
    }),
    __metadata("design:type", Object)
], DashboardStatsDto.prototype, "topProduct", void 0);
class CategoryCountDto {
    category;
    count;
}
exports.CategoryCountDto = CategoryCountDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Beverages" }),
    __metadata("design:type", String)
], CategoryCountDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 42, type: Number }),
    __metadata("design:type", Number)
], CategoryCountDto.prototype, "count", void 0);
class SalesPerProductDto {
    product;
    revenue;
    quantity;
}
exports.SalesPerProductDto = SalesPerProductDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Premium Coffee" }),
    __metadata("design:type", String)
], SalesPerProductDto.prototype, "product", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1250.5, type: Number }),
    __metadata("design:type", Number)
], SalesPerProductDto.prototype, "revenue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 25, type: Number }),
    __metadata("design:type", Number)
], SalesPerProductDto.prototype, "quantity", void 0);
class DashboardChartsDto {
    productsPerCategory;
    salesPerProduct;
}
exports.DashboardChartsDto = DashboardChartsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CategoryCountDto] }),
    __metadata("design:type", Array)
], DashboardChartsDto.prototype, "productsPerCategory", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [SalesPerProductDto] }),
    __metadata("design:type", Array)
], DashboardChartsDto.prototype, "salesPerProduct", void 0);
class PaginatedProductsDto {
    pageNumber;
    pageSize;
    totalElements;
    totalPages;
    content;
}
exports.PaginatedProductsDto = PaginatedProductsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], PaginatedProductsDto.prototype, "pageNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 10 }),
    __metadata("design:type", Number)
], PaginatedProductsDto.prototype, "pageSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 145 }),
    __metadata("design:type", Number)
], PaginatedProductsDto.prototype, "totalElements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 15 }),
    __metadata("design:type", Number)
], PaginatedProductsDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: "array" }),
    __metadata("design:type", Array)
], PaginatedProductsDto.prototype, "content", void 0);
class PaginatedSalesDto {
    pageNumber;
    pageSize;
    totalElements;
    totalPages;
    content;
}
exports.PaginatedSalesDto = PaginatedSalesDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 0 }),
    __metadata("design:type", Number)
], PaginatedSalesDto.prototype, "pageNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 10 }),
    __metadata("design:type", Number)
], PaginatedSalesDto.prototype, "pageSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 523 }),
    __metadata("design:type", Number)
], PaginatedSalesDto.prototype, "totalElements", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, example: 53 }),
    __metadata("design:type", Number)
], PaginatedSalesDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: "array" }),
    __metadata("design:type", Array)
], PaginatedSalesDto.prototype, "content", void 0);
class DashboardTablesDto {
    products;
    recentSales;
}
exports.DashboardTablesDto = DashboardTablesDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", PaginatedProductsDto)
], DashboardTablesDto.prototype, "products", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", PaginatedSalesDto)
], DashboardTablesDto.prototype, "recentSales", void 0);
class DashboardResponseDto {
    stats;
    charts;
    tables;
}
exports.DashboardResponseDto = DashboardResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", DashboardStatsDto)
], DashboardResponseDto.prototype, "stats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", DashboardChartsDto)
], DashboardResponseDto.prototype, "charts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", DashboardTablesDto)
], DashboardResponseDto.prototype, "tables", void 0);
//# sourceMappingURL=dashboard.dto.js.map