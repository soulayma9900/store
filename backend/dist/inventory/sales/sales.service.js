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
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const sale_schema_1 = require("../schemas/sale.schema");
const product_schema_1 = require("../schemas/product.schema");
const stock_movement_schema_1 = require("../schemas/stock-movement.schema");
const stock_movement_reason_enum_1 = require("../enums/stock-movement-reason.enum");
const number_utils_1 = require("../../common/utils/number-utils");
let SalesService = class SalesService {
    saleModel;
    productModel;
    stockMovementModel;
    constructor(saleModel, productModel, stockMovementModel) {
        this.saleModel = saleModel;
        this.productModel = productModel;
        this.stockMovementModel = stockMovementModel;
    }
    async create(request, performedBy) {
        const product = await this.productModel.findById(request.productId).exec();
        if (!product) {
            throw new common_1.NotFoundException("Product not found");
        }
        const qty = (0, number_utils_1.scaleQuantity)(request.quantity) ?? 0;
        if (qty <= 0) {
            throw new common_1.BadRequestException("Quantity must be greater than zero");
        }
        const price = (0, number_utils_1.scalePrice)(request.unitPrice);
        if (price === null || price <= 0) {
            throw new common_1.BadRequestException("Unit price must be greater than zero");
        }
        const saleDate = request.saleDate ? new Date(request.saleDate) : new Date();
        if (Number.isNaN(saleDate.getTime())) {
            throw new common_1.BadRequestException("Invalid sale date");
        }
        const currentQty = product.quantity ?? 0;
        const newQuantity = currentQty - qty;
        if (newQuantity < 0) {
            throw new common_1.BadRequestException("Stock quantity cannot be negative");
        }
        product.quantity = (0, number_utils_1.scaleQuantity)(newQuantity);
        await product.save();
        const sale = await this.saleModel.create({
            productId: product.id,
            quantity: qty,
            unitPrice: price,
            saleDate,
            note: request.note ?? null,
            performedBy,
            createdAt: new Date(),
        });
        await this.stockMovementModel.create({
            productId: product.id,
            delta: -qty,
            reason: stock_movement_reason_enum_1.StockMovementReason.SALE,
            batchId: null,
            supplierId: null,
            unitCost: null,
            note: request.note ?? null,
            performedBy,
            createdAt: saleDate,
        });
        return this.toResponse(sale, product.name);
    }
    async getAll(page = 0, size = 20, productId) {
        const query = {};
        if (productId && productId.trim() !== "") {
            query.productId = productId;
        }
        const total = await this.saleModel.countDocuments(query);
        const sales = await this.saleModel
            .find(query)
            .sort({ saleDate: -1 })
            .skip(page * size)
            .limit(size)
            .exec();
        const productIds = Array.from(new Set(sales.map((sale) => sale.productId)));
        const products = await this.productModel
            .find({ _id: { $in: productIds } })
            .exec();
        const productMap = new Map(products.map((product) => [product.id, product.name]));
        return {
            content: sales.map((sale) => this.toResponse(sale, productMap.get(sale.productId) ?? null)),
            totalElements: total,
            totalPages: Math.ceil(total / size),
            number: page,
            size,
        };
    }
    toResponse(sale, productName) {
        return {
            id: sale.id,
            productId: sale.productId,
            productName,
            quantity: sale.quantity,
            unitPrice: sale.unitPrice,
            saleDate: sale.saleDate ? sale.saleDate.toISOString() : null,
            note: sale.note ?? null,
            performedBy: sale.performedBy ?? null,
            createdAt: sale.createdAt ? sale.createdAt.toISOString() : null,
        };
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(sale_schema_1.Sale.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(2, (0, mongoose_1.InjectModel)(stock_movement_schema_1.StockMovement.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], SalesService);
//# sourceMappingURL=sales.service.js.map