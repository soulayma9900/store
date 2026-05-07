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
exports.SuppliersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const supplier_schema_1 = require("../schemas/supplier.schema");
let SuppliersService = class SuppliersService {
    supplierModel;
    constructor(supplierModel) {
        this.supplierModel = supplierModel;
    }
    async create(request) {
        const exists = await this.supplierModel.exists({
            name: new RegExp(`^${request.name}$`, 'i'),
        });
        if (exists) {
            throw new common_1.BadRequestException('Supplier name already exists');
        }
        const saved = await this.supplierModel.create({
            name: request.name.trim(),
            phone: request.phone ?? null,
            address: request.address ?? null,
            notes: request.notes ?? null,
        });
        return this.toResponse(saved);
    }
    async update(id, request) {
        const supplier = await this.supplierModel.findById(id).exec();
        if (!supplier) {
            throw new common_1.NotFoundException('Supplier not found');
        }
        const newName = request.name.trim();
        if (supplier.name.toLowerCase() !== newName.toLowerCase()) {
            const exists = await this.supplierModel.exists({
                name: new RegExp(`^${newName}$`, 'i'),
            });
            if (exists) {
                throw new common_1.BadRequestException('Supplier name already exists');
            }
        }
        supplier.name = newName;
        supplier.phone = request.phone ?? null;
        supplier.address = request.address ?? null;
        supplier.notes = request.notes ?? null;
        const saved = await supplier.save();
        return this.toResponse(saved);
    }
    async delete(id) {
        const exists = await this.supplierModel.exists({ _id: id });
        if (!exists) {
            throw new common_1.NotFoundException('Supplier not found');
        }
        await this.supplierModel.deleteOne({ _id: id }).exec();
    }
    async getById(id) {
        const supplier = await this.supplierModel.findById(id).exec();
        if (!supplier) {
            throw new common_1.NotFoundException('Supplier not found');
        }
        return this.toResponse(supplier);
    }
    async getAll() {
        const suppliers = await this.supplierModel.find().exec();
        return suppliers.map((supplier) => this.toResponse(supplier));
    }
    toResponse(supplier) {
        return {
            id: supplier.id,
            name: supplier.name,
            phone: supplier.phone ?? null,
            address: supplier.address ?? null,
            notes: supplier.notes ?? null,
        };
    }
};
exports.SuppliersService = SuppliersService;
exports.SuppliersService = SuppliersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(supplier_schema_1.Supplier.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SuppliersService);
//# sourceMappingURL=suppliers.service.js.map