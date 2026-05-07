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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("../inventory/schemas/product.schema");
const sale_schema_1 = require("../inventory/schemas/sale.schema");
const category_schema_1 = require("../inventory/schemas/category.schema");
let DashboardService = class DashboardService {
    productModel;
    saleModel;
    categoryModel;
    constructor(productModel, saleModel, categoryModel) {
        this.productModel = productModel;
        this.saleModel = saleModel;
        this.categoryModel = categoryModel;
    }
    async getDashboard() {
        const [stats, charts, tables] = await Promise.all([
            this.getStats(),
            this.getCharts(),
            this.getTables(),
        ]);
        return {
            stats,
            charts,
            tables,
        };
    }
    async getStats() {
        const [totalProducts, totalCategories, totalSales, salesData] = await Promise.all([
            this.productModel.countDocuments(),
            this.categoryModel.countDocuments(),
            this.saleModel.countDocuments(),
            this.saleModel.find().exec(),
        ]);
        let totalRevenue = 0;
        let avgPrice = 0;
        if (salesData && salesData.length > 0) {
            totalRevenue = salesData.reduce((sum, sale) => {
                return sum + sale.quantity * sale.unitPrice;
            }, 0);
        }
        const products = await this.productModel.find().exec();
        if (products && products.length > 0) {
            const priceSum = products.reduce((sum, p) => sum + p.price, 0);
            avgPrice = priceSum / products.length;
        }
        const topProductData = await this.saleModel.aggregate([
            {
                $group: {
                    _id: "$productId",
                    totalRevenue: {
                        $sum: { $multiply: ["$quantity", "$unitPrice"] },
                    },
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 1 },
        ]);
        let topProduct = { id: "", name: "", revenue: 0 };
        if (topProductData && topProductData.length > 0) {
            const topProductId = topProductData[0]._id;
            const productInfo = await this.productModel.findById(topProductId).exec();
            if (productInfo) {
                topProduct = {
                    id: topProductId,
                    name: productInfo.name,
                    revenue: topProductData[0].totalRevenue,
                };
            }
        }
        return {
            totalProducts,
            totalCategories,
            totalSales,
            totalRevenue,
            avgPrice: Math.round(avgPrice * 100) / 100,
            topProduct,
        };
    }
    async getCharts() {
        const [productsPerCategory, salesPerProduct] = await Promise.all([
            this.getProductsPerCategory(),
            this.getSalesPerProduct(),
        ]);
        return {
            productsPerCategory,
            salesPerProduct,
        };
    }
    async getProductsPerCategory() {
        const categories = await this.categoryModel.find().exec();
        const result = [];
        for (const category of categories) {
            const count = await this.productModel.countDocuments({
                categoryId: category._id.toString(),
            });
            result.push({
                category: category.name,
                count,
            });
        }
        return result;
    }
    async getSalesPerProduct() {
        const salesAgg = await this.saleModel.aggregate([
            {
                $group: {
                    _id: "$productId",
                    totalRevenue: {
                        $sum: { $multiply: ["$quantity", "$unitPrice"] },
                    },
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 10 },
        ]);
        const result = [];
        for (const sale of salesAgg) {
            const product = await this.productModel.findById(sale._id).exec();
            if (product) {
                result.push({
                    product: product.name,
                    revenue: sale.totalRevenue,
                    quantity: sale.totalQuantity,
                });
            }
        }
        return result;
    }
    async getTables() {
        const [products, recentSales] = await Promise.all([
            this.getProductsTable(),
            this.getRecentSalesTable(),
        ]);
        return {
            products,
            recentSales,
        };
    }
    async getProductsTable() {
        const page = 0;
        const size = 10;
        const skip = page * size;
        const [content, totalElements] = await Promise.all([
            this.productModel.find().skip(skip).limit(size).exec(),
            this.productModel.countDocuments(),
        ]);
        const totalPages = Math.ceil(totalElements / size);
        return {
            pageNumber: page,
            pageSize: size,
            totalElements,
            totalPages,
            content: content.map((p) => ({
                id: p._id,
                name: p.name,
                barcode: p.barcode,
                categoryId: p.categoryId,
                price: p.price,
                quantity: p.quantity,
                unit: p.unit,
                lowStockThreshold: p.lowStockThreshold,
            })),
        };
    }
    async getRecentSalesTable() {
        const page = 0;
        const size = 10;
        const skip = page * size;
        const [content, totalElements] = await Promise.all([
            this.saleModel
                .find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(size)
                .exec(),
            this.saleModel.countDocuments(),
        ]);
        const totalPages = Math.ceil(totalElements / size);
        const enrichedContent = await Promise.all(content.map(async (sale) => {
            const product = await this.productModel.findById(sale.productId).exec();
            return {
                id: sale._id,
                productId: sale.productId,
                productName: product?.name || "Unknown",
                quantity: sale.quantity,
                unitPrice: sale.unitPrice,
                totalPrice: sale.quantity * sale.unitPrice,
                saleDate: sale.saleDate,
                note: sale.note,
                performedBy: sale.performedBy,
            };
        }));
        return {
            pageNumber: page,
            pageSize: size,
            totalElements,
            totalPages,
            content: enrichedContent,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(sale_schema_1.Sale.name)),
    __param(2, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map