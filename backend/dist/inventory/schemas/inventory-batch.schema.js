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
exports.InventoryBatchSchema = exports.InventoryBatch = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let InventoryBatch = class InventoryBatch extends mongoose_2.Document {
    productId;
    supplierId;
    lotNumber;
    expiryDate;
    unitCost;
    quantityReceived;
    quantityRemaining;
    receivedAt;
    note;
    createdBy;
};
exports.InventoryBatch = InventoryBatch;
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], InventoryBatch.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, index: true }),
    __metadata("design:type", String)
], InventoryBatch.prototype, "supplierId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", Object)
], InventoryBatch.prototype, "lotNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Object)
], InventoryBatch.prototype, "expiryDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Object)
], InventoryBatch.prototype, "unitCost", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Object)
], InventoryBatch.prototype, "quantityReceived", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number }),
    __metadata("design:type", Object)
], InventoryBatch.prototype, "quantityRemaining", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Object)
], InventoryBatch.prototype, "receivedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", Object)
], InventoryBatch.prototype, "note", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", Object)
], InventoryBatch.prototype, "createdBy", void 0);
exports.InventoryBatch = InventoryBatch = __decorate([
    (0, mongoose_1.Schema)({ collection: 'inventory_batches', timestamps: false })
], InventoryBatch);
exports.InventoryBatchSchema = mongoose_1.SchemaFactory.createForClass(InventoryBatch);
//# sourceMappingURL=inventory-batch.schema.js.map