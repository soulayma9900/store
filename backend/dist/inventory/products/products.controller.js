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
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const products_service_1 = require("./products.service");
const product_create_dto_1 = require("./dto/product-create.dto");
const product_update_dto_1 = require("./dto/product-update.dto");
const product_bulk_category_dto_1 = require("./dto/product-bulk-category.dto");
const product_bulk_price_dto_1 = require("./dto/product-bulk-price.dto");
const stock_receive_dto_1 = require("./dto/stock-receive.dto");
const stock_waste_dto_1 = require("./dto/stock-waste.dto");
const stock_adjust_dto_1 = require("./dto/stock-adjust.dto");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_enum_1 = require("../../auth/roles.enum");
let ProductsController = class ProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    create(request) {
        return this.productsService.create(request);
    }
    update(id, request) {
        return this.productsService.update(id, request);
    }
    async delete(id) {
        await this.productsService.delete(id);
    }
    getById(id) {
        return this.productsService.getById(id);
    }
    getByBarcode(barcode) {
        return this.productsService.getByBarcode(barcode);
    }
    receiveStock(id, request, req) {
        const performedBy = req.user?.username ?? "system";
        return this.productsService.receiveStock(id, request, performedBy);
    }
    wasteStock(id, request, req) {
        const performedBy = req.user?.username ?? "system";
        return this.productsService.wasteStock(id, request, performedBy);
    }
    adjustStock(id, request, req) {
        const performedBy = req.user?.username ?? "system";
        return this.productsService.adjustStock(id, request, performedBy);
    }
    getMovements(id, page = "0", size = "20") {
        return this.productsService.getStockMovements(id, Number(page), Number(size));
    }
    getBatches(id, availableOnly = "true") {
        return this.productsService.getBatches(id, availableOnly !== "false");
    }
    getAll(page = "0", size = "20", sortBy = "name", sortDir = "asc", name, categoryId, supplierId) {
        return this.productsService.getAll(Number(page), Number(size), sortBy, sortDir, name, categoryId, supplierId);
    }
    getLowStockAlerts() {
        return this.productsService.getLowStockAlerts();
    }
    getReorderList() {
        return this.productsService.getReorderList();
    }
    async snoozeLowStock(id, days = "7") {
        const until = new Date();
        until.setDate(until.getDate() + Number(days));
        await this.productsService.snoozeLowStock(id, until);
    }
    async bulkUpdateCategory(request) {
        await this.productsService.bulkUpdateCategory(request);
    }
    async bulkUpdatePrice(request) {
        await this.productsService.bulkUpdatePrice(request);
    }
    importCsv(file) {
        return this.productsService.importCsv(file);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_create_dto_1.ProductCreateDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(":id"),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, product_update_dto_1.ProductUpdateDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.STAFF),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)("by-barcode/:barcode"),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.STAFF),
    __param(0, (0, common_1.Param)("barcode")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getByBarcode", null);
__decorate([
    (0, common_1.Post)(":id/stock/receive"),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, stock_receive_dto_1.StockReceiveDto, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "receiveStock", null);
__decorate([
    (0, common_1.Post)(":id/stock/waste"),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, stock_waste_dto_1.StockWasteDto, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "wasteStock", null);
__decorate([
    (0, common_1.Post)(":id/stock/adjust"),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, stock_adjust_dto_1.StockAdjustDto, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "adjustStock", null);
__decorate([
    (0, common_1.Get)(":id/stock/movements"),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.STAFF),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("size")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getMovements", null);
__decorate([
    (0, common_1.Get)(":id/stock/batches"),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.STAFF),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("availableOnly")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getBatches", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.STAFF),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("size")),
    __param(2, (0, common_1.Query)("sortBy")),
    __param(3, (0, common_1.Query)("sortDir")),
    __param(4, (0, common_1.Query)("name")),
    __param(5, (0, common_1.Query)("categoryId")),
    __param(6, (0, common_1.Query)("supplierId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, String, String, String]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)("alerts/low-stock"),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.STAFF),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "getLowStockAlerts", null);
__decorate([
    (0, common_1.Get)("reorder-list"),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.STAFF),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "getReorderList", null);
__decorate([
    (0, common_1.Post)(":id/alerts/snooze"),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)("days")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "snoozeLowStock", null);
__decorate([
    (0, common_1.Patch)("bulk/category"),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_bulk_category_dto_1.ProductBulkCategoryDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "bulkUpdateCategory", null);
__decorate([
    (0, common_1.Patch)("bulk/price"),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_bulk_price_dto_1.ProductBulkPriceDto]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "bulkUpdatePrice", null);
__decorate([
    (0, common_1.Post)("import-csv"),
    (0, swagger_1.ApiConsumes)("multipart/form-data"),
    (0, swagger_1.ApiBody)({
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                },
            },
            required: ["file"],
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("file")),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductsController.prototype, "importCsv", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)("products"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map