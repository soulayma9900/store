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
exports.ProductUpdateDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const unit_enum_1 = require("../../enums/unit.enum");
class ProductUpdateDto {
    name;
    barcode;
    categoryId;
    primarySupplierId;
    price;
    unit;
    imageUrl;
    notes;
    lowStockThreshold;
}
exports.ProductUpdateDto = ProductUpdateDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Coffee Beans 1kg" }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], ProductUpdateDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "0123456789012" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(128),
    __metadata("design:type", Object)
], ProductUpdateDto.prototype, "barcode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "65f1c2d3a4b5c6d7e8f90123" }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductUpdateDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "65f1c2d3a4b5c6d7e8f90124" }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductUpdateDto.prototype, "primarySupplierId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12.5, type: Number }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1000000),
    __metadata("design:type", Number)
], ProductUpdateDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: unit_enum_1.Unit, example: unit_enum_1.Unit.PIECE }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductUpdateDto.prototype, "unit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "https://example.com/image.png" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(2048),
    __metadata("design:type", Object)
], ProductUpdateDto.prototype, "imageUrl", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Seasonal product" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(5000),
    __metadata("design:type", Object)
], ProductUpdateDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, type: Number }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(1000000),
    __metadata("design:type", Number)
], ProductUpdateDto.prototype, "lowStockThreshold", void 0);
//# sourceMappingURL=product-update.dto.js.map