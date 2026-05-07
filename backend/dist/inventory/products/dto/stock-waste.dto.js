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
exports.StockWasteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const stock_movement_reason_enum_1 = require("../../enums/stock-movement-reason.enum");
class StockWasteDto {
    batchId;
    quantity;
    reason;
    note;
}
exports.StockWasteDto = StockWasteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "65f1c2d3a4b5c6d7e8f90125" }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], StockWasteDto.prototype, "batchId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1.5, type: Number }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.001),
    __metadata("design:type", Number)
], StockWasteDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: stock_movement_reason_enum_1.StockMovementReason,
        example: stock_movement_reason_enum_1.StockMovementReason.WASTE,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], StockWasteDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "Expired on shelf" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", Object)
], StockWasteDto.prototype, "note", void 0);
//# sourceMappingURL=stock-waste.dto.js.map