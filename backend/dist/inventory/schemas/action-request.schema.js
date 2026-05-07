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
exports.ActionRequestSchema = exports.ActionRequest = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const request_status_enum_1 = require("../requests/enums/request-status.enum");
const request_type_enum_1 = require("../requests/enums/request-type.enum");
let ActionRequest = class ActionRequest extends mongoose_2.Document {
    type;
    status;
    productId;
    payload;
    createdBy;
    createdAt;
    reviewedBy;
    reviewedAt;
    reviewNote;
};
exports.ActionRequest = ActionRequest;
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: request_type_enum_1.RequestType, required: true }),
    __metadata("design:type", String)
], ActionRequest.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: request_status_enum_1.RequestStatus, required: true }),
    __metadata("design:type", String)
], ActionRequest.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, index: true }),
    __metadata("design:type", Object)
], ActionRequest.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], ActionRequest.prototype, "payload", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, index: true }),
    __metadata("design:type", String)
], ActionRequest.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, required: true }),
    __metadata("design:type", Date)
], ActionRequest.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", Object)
], ActionRequest.prototype, "reviewedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date }),
    __metadata("design:type", Object)
], ActionRequest.prototype, "reviewedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", Object)
], ActionRequest.prototype, "reviewNote", void 0);
exports.ActionRequest = ActionRequest = __decorate([
    (0, mongoose_1.Schema)({ collection: 'action_requests', timestamps: false })
], ActionRequest);
exports.ActionRequestSchema = mongoose_1.SchemaFactory.createForClass(ActionRequest);
//# sourceMappingURL=action-request.schema.js.map