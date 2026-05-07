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
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const action_request_schema_1 = require("../schemas/action-request.schema");
const request_type_enum_1 = require("./enums/request-type.enum");
const request_status_enum_1 = require("./enums/request-status.enum");
const products_service_1 = require("../products/products.service");
const product_schema_1 = require("../schemas/product.schema");
let RequestsService = class RequestsService {
    requestModel;
    productModel;
    productsService;
    constructor(requestModel, productModel, productsService) {
        this.requestModel = requestModel;
        this.productModel = productModel;
        this.productsService = productsService;
    }
    async createRestockRequest(request, createdBy) {
        await this.ensureProductExists(request.productId);
        return this.createRequest(request_type_enum_1.RequestType.RESTOCK_REQUEST, request.productId, {
            quantity: request.quantity,
            supplierId: request.supplierId ?? null,
            costPrice: request.costPrice ?? null,
            lotNumber: request.lotNumber ?? null,
            expiryDate: request.expiryDate ?? null,
            note: request.note ?? null,
        }, createdBy, request.draft === true);
    }
    async createDamageReport(request, createdBy) {
        await this.ensureProductExists(request.productId);
        return this.createRequest(request_type_enum_1.RequestType.DAMAGE_REPORT, request.productId, {
            batchId: request.batchId,
            quantity: request.quantity,
            reason: request.reason,
            note: request.note ?? null,
        }, createdBy, request.draft === true);
    }
    async createProductSuggestion(request, createdBy) {
        return this.createRequest(request_type_enum_1.RequestType.PRODUCT_SUGGESTION, null, {
            name: request.name,
            barcode: request.barcode ?? null,
            categoryId: request.categoryId,
            primarySupplierId: request.primarySupplierId,
            price: request.price,
            unit: request.unit,
            imageUrl: request.imageUrl ?? null,
            notes: request.notes ?? null,
            lowStockThreshold: request.lowStockThreshold,
        }, createdBy, request.draft === true);
    }
    async createProductNote(request, createdBy) {
        await this.ensureProductExists(request.productId);
        return this.createRequest(request_type_enum_1.RequestType.PRODUCT_NOTE, request.productId, {
            note: request.note,
        }, createdBy, request.draft === true);
    }
    async getAll(page, size, filters, createdBy, isAdmin) {
        const query = {};
        if (filters.status)
            query.status = filters.status;
        if (filters.type)
            query.type = filters.type;
        if (filters.productId)
            query.productId = filters.productId;
        if (!isAdmin)
            query.createdBy = createdBy;
        const total = await this.requestModel.countDocuments(query);
        const requests = await this.requestModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip(page * size)
            .limit(size)
            .exec();
        return {
            content: requests.map((request) => this.toResponse(request)),
            totalElements: total,
            totalPages: Math.ceil(total / size),
            number: page,
            size,
        };
    }
    async submitRequest(id, submittedBy, isAdmin) {
        const request = await this.findRequestForUser(id, submittedBy, isAdmin);
        if (request.status !== request_status_enum_1.RequestStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft requests can be submitted');
        }
        request.status = request_status_enum_1.RequestStatus.SUBMITTED;
        const saved = await request.save();
        return this.toResponse(saved);
    }
    async approveRequest(id, reviewedBy, reviewNote) {
        const request = await this.requestModel.findById(id).exec();
        if (!request) {
            throw new common_1.NotFoundException('Request not found');
        }
        if (request.status !== request_status_enum_1.RequestStatus.SUBMITTED) {
            throw new common_1.BadRequestException('Only submitted requests can be approved');
        }
        await this.applyApproval(request, reviewedBy);
        request.status = request_status_enum_1.RequestStatus.APPROVED;
        request.reviewedBy = reviewedBy;
        request.reviewedAt = new Date();
        request.reviewNote = reviewNote ?? null;
        const saved = await request.save();
        return this.toResponse(saved);
    }
    async rejectRequest(id, reviewedBy, reviewNote) {
        const request = await this.requestModel.findById(id).exec();
        if (!request) {
            throw new common_1.NotFoundException('Request not found');
        }
        if (request.status !== request_status_enum_1.RequestStatus.SUBMITTED) {
            throw new common_1.BadRequestException('Only submitted requests can be rejected');
        }
        request.status = request_status_enum_1.RequestStatus.REJECTED;
        request.reviewedBy = reviewedBy;
        request.reviewedAt = new Date();
        request.reviewNote = reviewNote ?? null;
        const saved = await request.save();
        return this.toResponse(saved);
    }
    async createRequest(type, productId, payload, createdBy, isDraft) {
        const status = isDraft ? request_status_enum_1.RequestStatus.DRAFT : request_status_enum_1.RequestStatus.SUBMITTED;
        const created = await this.requestModel.create({
            type,
            status,
            productId,
            payload,
            createdBy,
            createdAt: new Date(),
        });
        return this.toResponse(created);
    }
    async ensureProductExists(productId) {
        const exists = await this.productModel.exists({ _id: productId });
        if (!exists) {
            throw new common_1.NotFoundException('Product not found');
        }
    }
    async findRequestForUser(id, username, isAdmin) {
        const request = await this.requestModel.findById(id).exec();
        if (!request) {
            throw new common_1.NotFoundException('Request not found');
        }
        if (!isAdmin && request.createdBy !== username) {
            throw new common_1.ForbiddenException('Request is not accessible');
        }
        return request;
    }
    getPayload(request) {
        const payload = request.payload;
        if (!payload) {
            throw new common_1.BadRequestException('Request payload is missing');
        }
        return payload;
    }
    async applyApproval(request, reviewedBy) {
        switch (request.type) {
            case request_type_enum_1.RequestType.RESTOCK_REQUEST:
                await this.applyRestock(request, reviewedBy);
                return;
            case request_type_enum_1.RequestType.DAMAGE_REPORT:
                await this.applyDamageReport(request, reviewedBy);
                return;
            case request_type_enum_1.RequestType.PRODUCT_SUGGESTION:
                await this.applyProductSuggestion(request);
                return;
            case request_type_enum_1.RequestType.PRODUCT_NOTE:
                await this.applyProductNote(request);
                return;
            default:
                throw new common_1.BadRequestException('Unsupported request type');
        }
    }
    async applyRestock(request, reviewedBy) {
        if (!request.productId) {
            throw new common_1.BadRequestException('Product is required for restock');
        }
        const payload = this.getPayload(request);
        const product = await this.productModel.findById(request.productId).exec();
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const costPrice = payload.costPrice ?? product.costPrice ?? null;
        if (!costPrice || costPrice <= 0) {
            throw new common_1.BadRequestException('Cost price is required to approve this restock request');
        }
        const dto = {
            quantity: payload.quantity,
            costPrice,
        };
        if (payload.supplierId) {
            dto.supplierId = payload.supplierId;
        }
        if (payload.lotNumber) {
            dto.lotNumber = payload.lotNumber;
        }
        if (payload.expiryDate) {
            dto.expiryDate = payload.expiryDate;
        }
        if (payload.note) {
            dto.note = payload.note;
        }
        await this.productsService.receiveStock(request.productId, dto, reviewedBy);
    }
    async applyDamageReport(request, reviewedBy) {
        if (!request.productId) {
            throw new common_1.BadRequestException('Product is required for damage reports');
        }
        const payload = this.getPayload(request);
        const dto = {
            batchId: payload.batchId,
            quantity: payload.quantity,
            reason: payload.reason,
        };
        if (payload.note) {
            dto.note = payload.note;
        }
        await this.productsService.wasteStock(request.productId, dto, reviewedBy);
    }
    async applyProductSuggestion(request) {
        const payload = this.getPayload(request);
        await this.productsService.create(payload);
    }
    async applyProductNote(request) {
        if (!request.productId) {
            throw new common_1.BadRequestException('Product is required for product notes');
        }
        const payload = this.getPayload(request);
        const note = payload.note?.trim();
        if (!note) {
            throw new common_1.BadRequestException('Note is required');
        }
        const product = await this.productModel.findById(request.productId).exec();
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const prefix = `Staff note (${request.createdBy}): ${note}`;
        product.notes = product.notes ? `${product.notes}\n${prefix}` : prefix;
        await product.save();
    }
    toResponse(request) {
        return {
            id: request.id,
            type: request.type,
            status: request.status,
            productId: request.productId ?? null,
            payload: request.payload ?? null,
            createdBy: request.createdBy,
            createdAt: request.createdAt ? request.createdAt.toISOString() : null,
            reviewedBy: request.reviewedBy ?? null,
            reviewedAt: request.reviewedAt ? request.reviewedAt.toISOString() : null,
            reviewNote: request.reviewNote ?? null,
        };
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(action_request_schema_1.ActionRequest.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        products_service_1.ProductsService])
], RequestsService);
//# sourceMappingURL=requests.service.js.map