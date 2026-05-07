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
exports.SaleCreateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SaleCreateDto {
    productId;
    quantity;
    unitPrice;
    saleDate;
    note;
}
exports.SaleCreateDto = SaleCreateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "65f1c2d3a4b5c6d7e8f90123" }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SaleCreateDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, type: Number }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.001),
    __metadata("design:type", Number)
], SaleCreateDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5.25, type: Number }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], SaleCreateDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "2026-04-27T10:30:00.000Z", type: String }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SaleCreateDto.prototype, "saleDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Cash sale" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", Object)
], SaleCreateDto.prototype, "note", void 0);
//# sourceMappingURL=sale-create.dto.js.map