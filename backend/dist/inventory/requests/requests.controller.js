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
exports.RequestsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_enum_1 = require("../../auth/roles.enum");
const requests_service_1 = require("./requests.service");
const restock_request_dto_1 = require("./dto/restock-request.dto");
const damage_report_dto_1 = require("./dto/damage-report.dto");
const product_suggestion_dto_1 = require("./dto/product-suggestion.dto");
const product_note_dto_1 = require("./dto/product-note.dto");
const request_review_dto_1 = require("./dto/request-review.dto");
const request_status_enum_1 = require("./enums/request-status.enum");
const request_type_enum_1 = require("./enums/request-type.enum");
let RequestsController = class RequestsController {
    requestsService;
    constructor(requestsService) {
        this.requestsService = requestsService;
    }
    createRestock(request, req) {
        const createdBy = req.user?.username ?? 'system';
        return this.requestsService.createRestockRequest(request, createdBy);
    }
    createDamage(request, req) {
        const createdBy = req.user?.username ?? 'system';
        return this.requestsService.createDamageReport(request, createdBy);
    }
    createProductSuggestion(request, req) {
        const createdBy = req.user?.username ?? 'system';
        return this.requestsService.createProductSuggestion(request, createdBy);
    }
    createProductNote(request, req) {
        const createdBy = req.user?.username ?? 'system';
        return this.requestsService.createProductNote(request, createdBy);
    }
    getAll(page = '0', size = '20', status, type, productId, req = {}) {
        const roles = req.user?.roles ?? [];
        const isAdmin = roles.includes(roles_enum_1.Role.ADMIN);
        const username = req.user?.username ?? 'system';
        return this.requestsService.getAll(Number(page), Number(size), { status, type, productId }, username, isAdmin);
    }
    submit(id, req) {
        const roles = req.user?.roles ?? [];
        const isAdmin = roles.includes(roles_enum_1.Role.ADMIN);
        const username = req.user?.username ?? 'system';
        return this.requestsService.submitRequest(id, username, isAdmin);
    }
    approve(id, review, req) {
        const reviewedBy = req.user?.username ?? 'system';
        return this.requestsService.approveRequest(id, reviewedBy, review.reviewNote ?? null);
    }
    reject(id, review, req) {
        const reviewedBy = req.user?.username ?? 'system';
        return this.requestsService.rejectRequest(id, reviewedBy, review.reviewNote ?? null);
    }
};
exports.RequestsController = RequestsController;
__decorate([
    (0, common_1.Post)('restock'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.STAFF),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [restock_request_dto_1.RestockRequestDto, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "createRestock", null);
__decorate([
    (0, common_1.Post)('damage'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.STAFF),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [damage_report_dto_1.DamageReportDto, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "createDamage", null);
__decorate([
    (0, common_1.Post)('product-suggestion'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.STAFF),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_suggestion_dto_1.ProductSuggestionDto, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "createProductSuggestion", null);
__decorate([
    (0, common_1.Post)('product-note'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.STAFF),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_note_dto_1.ProductNoteDto, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "createProductNote", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.STAFF),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('size')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('type')),
    __param(4, (0, common_1.Query)('productId')),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Patch)(':id/submit'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.STAFF),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "submit", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_review_dto_1.RequestReviewDto, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "approve", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, request_review_dto_1.RequestReviewDto, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "reject", null);
exports.RequestsController = RequestsController = __decorate([
    (0, common_1.Controller)('requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [requests_service_1.RequestsService])
], RequestsController);
//# sourceMappingURL=requests.controller.js.map