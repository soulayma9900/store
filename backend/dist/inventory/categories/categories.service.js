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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const category_schema_1 = require("../schemas/category.schema");
const product_schema_1 = require("../schemas/product.schema");
const number_utils_1 = require("../../common/utils/number-utils");
let CategoriesService = class CategoriesService {
    categoryModel;
    productModel;
    constructor(categoryModel, productModel) {
        this.categoryModel = categoryModel;
        this.productModel = productModel;
    }
    async create(request) {
        const exists = await this.categoryModel.exists({
            name: new RegExp(`^${request.name}$`, 'i'),
        });
        if (exists) {
            throw new common_1.BadRequestException('Category name already exists');
        }
        const saved = await this.categoryModel.create({
            name: request.name.trim(),
            defaultLowStockThreshold: (0, number_utils_1.scaleThreshold)(request.defaultLowStockThreshold),
        });
        return this.toResponse(saved);
    }
    async update(id, request) {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const newName = request.name.trim();
        if (category.name.toLowerCase() !== newName.toLowerCase()) {
            const exists = await this.categoryModel.exists({
                name: new RegExp(`^${newName}$`, 'i'),
            });
            if (exists) {
                throw new common_1.BadRequestException('Category name already exists');
            }
        }
        category.name = newName;
        category.defaultLowStockThreshold = (0, number_utils_1.scaleThreshold)(request.defaultLowStockThreshold);
        const saved = await category.save();
        return this.toResponse(saved);
    }
    async delete(id) {
        const exists = await this.categoryModel.exists({ _id: id });
        if (!exists) {
            throw new common_1.NotFoundException('Category not found');
        }
        const hasProducts = await this.productModel.exists({ categoryId: id });
        if (hasProducts) {
            throw new common_1.BadRequestException('Cannot delete category while products reference it');
        }
        await this.categoryModel.deleteOne({ _id: id }).exec();
    }
    async getById(id) {
        const category = await this.categoryModel.findById(id).exec();
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return this.toResponse(category);
    }
    async getAll() {
        const categories = await this.categoryModel.find().exec();
        return categories.map((category) => this.toResponse(category));
    }
    toResponse(category) {
        return {
            id: category.id,
            name: category.name,
            defaultLowStockThreshold: category.defaultLowStockThreshold ?? null,
        };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map