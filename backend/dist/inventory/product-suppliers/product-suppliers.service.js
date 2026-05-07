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
exports.ProductSuppliersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_supplier_schema_1 = require("../schemas/product-supplier.schema");
const product_supplier_history_schema_1 = require("../schemas/product-supplier-history.schema");
const product_schema_1 = require("../schemas/product.schema");
const supplier_schema_1 = require("../schemas/supplier.schema");
const number_utils_1 = require("../../common/utils/number-utils");
let ProductSuppliersService = class ProductSuppliersService {
    productSupplierModel;
    historyModel;
    productModel;
    supplierModel;
    constructor(productSupplierModel, historyModel, productModel, supplierModel) {
        this.productSupplierModel = productSupplierModel;
        this.historyModel = historyModel;
        this.productModel = productModel;
        this.supplierModel = supplierModel;
    }
    async upsert(productId, request, updatedBy) {
        const product = await this.productModel.findById(productId).exec();
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const supplier = await this.supplierModel
            .findById(request.supplierId)
            .exec();
        if (!supplier) {
            throw new common_1.NotFoundException('Supplier not found');
        }
        const existing = await this.productSupplierModel
            .findOne({ productId: product.id, supplierId: supplier.id })
            .exec();
        const now = new Date();
        const newPrice = (0, number_utils_1.scalePrice)(request.negotiatedPrice);
        const priceChanged = !existing ||
            existing.negotiatedPrice === null ||
            existing.negotiatedPrice === undefined ||
            Number(existing.negotiatedPrice) !== Number(newPrice);
        const doc = existing ?? new this.productSupplierModel();
        doc.productId = product.id;
        doc.supplierId = supplier.id;
        doc.negotiatedPrice = newPrice;
        doc.note = request.note ?? null;
        doc.updatedAt = now;
        const saved = await doc.save();
        if (priceChanged) {
            await this.historyModel.create({
                productId: product.id,
                supplierId: supplier.id,
                negotiatedPrice: newPrice,
                note: request.note ?? null,
                updatedBy,
                effectiveAt: now,
            });
        }
        return this.toResponse(saved, supplier.name);
    }
    async getSuppliersForProduct(productId) {
        const exists = await this.productModel.exists({ _id: productId });
        if (!exists) {
            throw new common_1.NotFoundException('Product not found');
        }
        const suppliers = await this.supplierModel.find().exec();
        const supplierMap = new Map(suppliers.map((s) => [s.id, s]));
        const links = await this.productSupplierModel.find({ productId }).exec();
        return links.map((item) => this.toResponse(item, supplierMap.get(item.supplierId)?.name ?? '-'));
    }
    async getHistoryForProduct(productId) {
        const exists = await this.productModel.exists({ _id: productId });
        if (!exists) {
            throw new common_1.NotFoundException('Product not found');
        }
        const suppliers = await this.supplierModel.find().exec();
        const supplierMap = new Map(suppliers.map((s) => [s.id, s]));
        const history = await this.historyModel
            .find({ productId })
            .sort({ effectiveAt: -1 })
            .exec();
        return history.map((item) => ({
            id: item.id,
            productId: item.productId,
            supplierId: item.supplierId,
            supplierName: supplierMap.get(item.supplierId)?.name ?? '-',
            negotiatedPrice: item.negotiatedPrice ?? null,
            note: item.note ?? null,
            updatedBy: item.updatedBy ?? null,
            effectiveAt: item.effectiveAt ? item.effectiveAt.toISOString() : null,
        }));
    }
    async getProductsForSupplier(supplierId) {
        const supplier = await this.supplierModel.findById(supplierId).exec();
        if (!supplier) {
            throw new common_1.NotFoundException('Supplier not found');
        }
        const links = await this.productSupplierModel.find({ supplierId }).exec();
        return links.map((item) => this.toResponse(item, supplier.name));
    }
    toResponse(item, supplierName) {
        return {
            id: item.id,
            productId: item.productId,
            supplierId: item.supplierId,
            supplierName,
            negotiatedPrice: item.negotiatedPrice ?? null,
            note: item.note ?? null,
            updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
        };
    }
};
exports.ProductSuppliersService = ProductSuppliersService;
exports.ProductSuppliersService = ProductSuppliersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_supplier_schema_1.ProductSupplier.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_supplier_history_schema_1.ProductSupplierHistory.name)),
    __param(2, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(3, (0, mongoose_1.InjectModel)(supplier_schema_1.Supplier.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ProductSuppliersService);
//# sourceMappingURL=product-suppliers.service.js.map