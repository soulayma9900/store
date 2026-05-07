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
exports.ProductSuppliersController = void 0;
const common_1 = require("@nestjs/common");
const product_suppliers_service_1 = require("./product-suppliers.service");
const product_supplier_request_dto_1 = require("./dto/product-supplier-request.dto");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_enum_1 = require("../../auth/roles.enum");
let ProductSuppliersController = class ProductSuppliersController {
    productSuppliersService;
    constructor(productSuppliersService) {
        this.productSuppliersService = productSuppliersService;
    }
    upsert(productId, request, req) {
        const updatedBy = req.user?.username ?? 'system';
        return this.productSuppliersService.upsert(productId, request, updatedBy);
    }
    getSuppliers(productId) {
        return this.productSuppliersService.getSuppliersForProduct(productId);
    }
    getHistory(productId) {
        return this.productSuppliersService.getHistoryForProduct(productId);
    }
    getProductsForSupplier(supplierId) {
        return this.productSuppliersService.getProductsForSupplier(supplierId);
    }
};
exports.ProductSuppliersController = ProductSuppliersController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, product_supplier_request_dto_1.ProductSupplierRequestDto, Object]),
    __metadata("design:returntype", Promise)
], ProductSuppliersController.prototype, "upsert", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.STAFF),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductSuppliersController.prototype, "getSuppliers", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.STAFF),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductSuppliersController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('by-supplier/:supplierId'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.STAFF),
    __param(0, (0, common_1.Param)('supplierId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductSuppliersController.prototype, "getProductsForSupplier", null);
exports.ProductSuppliersController = ProductSuppliersController = __decorate([
    (0, common_1.Controller)('products/:productId/suppliers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [product_suppliers_service_1.ProductSuppliersService])
], ProductSuppliersController);
//# sourceMappingURL=product-suppliers.controller.js.map