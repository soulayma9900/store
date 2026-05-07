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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("../schemas/product.schema");
const category_schema_1 = require("../schemas/category.schema");
const supplier_schema_1 = require("../schemas/supplier.schema");
const product_supplier_schema_1 = require("../schemas/product-supplier.schema");
const product_supplier_history_schema_1 = require("../schemas/product-supplier-history.schema");
const inventory_batch_schema_1 = require("../schemas/inventory-batch.schema");
const stock_movement_schema_1 = require("../schemas/stock-movement.schema");
const stock_movement_reason_enum_1 = require("../enums/stock-movement-reason.enum");
const unit_enum_1 = require("../enums/unit.enum");
const number_utils_1 = require("../../common/utils/number-utils");
const sync_1 = require("csv-parse/sync");
let ProductsService = class ProductsService {
    productModel;
    categoryModel;
    supplierModel;
    productSupplierModel;
    productSupplierHistoryModel;
    inventoryBatchModel;
    stockMovementModel;
    constructor(productModel, categoryModel, supplierModel, productSupplierModel, productSupplierHistoryModel, inventoryBatchModel, stockMovementModel) {
        this.productModel = productModel;
        this.categoryModel = categoryModel;
        this.supplierModel = supplierModel;
        this.productSupplierModel = productSupplierModel;
        this.productSupplierHistoryModel = productSupplierHistoryModel;
        this.inventoryBatchModel = inventoryBatchModel;
        this.stockMovementModel = stockMovementModel;
    }
    async create(request) {
        const name = request.name.trim();
        await this.ensureCategoryExists(request.categoryId);
        const supplier = await this.ensureSupplierExists(request.primarySupplierId);
        await this.ensureDuplicateProduct(name, request.categoryId, null);
        const barcode = this.normalizeBarcode(request.barcode ?? null);
        await this.ensureBarcodeUnique(barcode, null);
        const scaledPrice = (0, number_utils_1.scalePrice)(request.price);
        if (scaledPrice === null) {
            throw new common_1.BadRequestException("Price is required");
        }
        const saved = await this.productModel.create({
            name,
            barcode,
            categoryId: request.categoryId,
            primarySupplierId: request.primarySupplierId,
            costPrice: null,
            price: scaledPrice,
            quantity: (0, number_utils_1.scaleQuantity)(0),
            unit: request.unit,
            imageUrl: request.imageUrl ?? null,
            notes: request.notes ?? null,
            lowStockThreshold: (0, number_utils_1.scaleThreshold)(request.lowStockThreshold),
            lowStockSnoozedUntil: null,
        });
        await this.upsertProductSupplier(saved.id, supplier, null, request.notes ?? null, "system");
        return this.toResponse(saved);
    }
    async update(id, request) {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new common_1.NotFoundException("Product not found");
        }
        await this.ensureCategoryExists(request.categoryId);
        const supplier = await this.ensureSupplierExists(request.primarySupplierId);
        const newName = request.name.trim();
        if (product.name.toLowerCase() !== newName.toLowerCase() ||
            product.categoryId !== request.categoryId) {
            await this.ensureDuplicateProduct(newName, request.categoryId, id);
        }
        const barcode = this.normalizeBarcode(request.barcode ?? null);
        await this.ensureBarcodeUnique(barcode, id);
        product.name = newName;
        product.barcode = barcode;
        product.categoryId = request.categoryId;
        product.primarySupplierId = request.primarySupplierId;
        const scaledPrice = (0, number_utils_1.scalePrice)(request.price);
        if (scaledPrice === null) {
            throw new common_1.BadRequestException("Price is required");
        }
        product.price = scaledPrice;
        product.unit = request.unit;
        product.imageUrl = request.imageUrl ?? null;
        product.notes = request.notes ?? null;
        product.lowStockThreshold = (0, number_utils_1.scaleThreshold)(request.lowStockThreshold);
        const saved = await product.save();
        await this.upsertProductSupplier(saved.id, supplier, null, request.notes ?? null, "system");
        return this.toResponse(saved);
    }
    async delete(id) {
        const exists = await this.productModel.exists({ _id: id });
        if (!exists) {
            throw new common_1.NotFoundException("Product not found");
        }
        await this.productModel.deleteOne({ _id: id }).exec();
    }
    async getById(id) {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new common_1.NotFoundException("Product not found");
        }
        return this.toResponse(product);
    }
    async getByBarcode(barcode) {
        const normalized = this.normalizeBarcode(barcode);
        if (!normalized) {
            throw new common_1.BadRequestException("Barcode is required");
        }
        const product = await this.productModel
            .findOne({ barcode: normalized })
            .exec();
        if (!product) {
            throw new common_1.NotFoundException("Product not found");
        }
        return this.toResponse(product);
    }
    async receiveStock(id, request, performedBy) {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new common_1.NotFoundException("Product not found");
        }
        let supplierId = request.supplierId ?? null;
        if (!supplierId || supplierId.trim() === "") {
            supplierId = product.primarySupplierId;
        }
        const supplier = await this.ensureSupplierExists(supplierId);
        if (!request.costPrice || request.costPrice <= 0) {
            throw new common_1.BadRequestException("Cost price is required for receiving stock");
        }
        const delta = (0, number_utils_1.scaleQuantity)(request.quantity) ?? 0;
        const currentQty = product.quantity ?? 0;
        const newQuantity = currentQty + delta;
        product.quantity = (0, number_utils_1.scaleQuantity)(newQuantity);
        product.primarySupplierId = supplierId;
        product.costPrice = (0, number_utils_1.scalePrice)(request.costPrice);
        const saved = await product.save();
        let lotNumber = request.lotNumber ?? null;
        if (!lotNumber || lotNumber.trim() === "") {
            lotNumber = await this.generateNextBatchNumber(id);
        }
        const batch = await this.inventoryBatchModel.create({
            productId: id,
            supplierId,
            lotNumber,
            expiryDate: request.expiryDate ? new Date(request.expiryDate) : null,
            unitCost: (0, number_utils_1.scalePrice)(request.costPrice),
            quantityReceived: (0, number_utils_1.scaleQuantity)(request.quantity),
            quantityRemaining: (0, number_utils_1.scaleQuantity)(request.quantity),
            receivedAt: new Date(),
            note: request.note ?? null,
            createdBy: performedBy,
        });
        await this.stockMovementModel.create({
            productId: id,
            delta,
            reason: stock_movement_reason_enum_1.StockMovementReason.RECEIVE,
            batchId: batch.id,
            supplierId,
            unitCost: (0, number_utils_1.scalePrice)(request.costPrice),
            note: request.note ?? null,
            performedBy,
            createdAt: new Date(),
        });
        await this.upsertProductSupplier(saved.id, supplier, request.costPrice, request.note ?? null, performedBy);
        return this.toResponse(saved);
    }
    async wasteStock(id, request, performedBy) {
        if (request.reason !== stock_movement_reason_enum_1.StockMovementReason.WASTE &&
            request.reason !== stock_movement_reason_enum_1.StockMovementReason.SPOILAGE) {
            throw new common_1.BadRequestException("Invalid reason for waste stock");
        }
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new common_1.NotFoundException("Product not found");
        }
        const batch = await this.inventoryBatchModel
            .findOne({ _id: request.batchId, productId: id })
            .exec();
        if (!batch) {
            throw new common_1.NotFoundException("Batch not found for product");
        }
        const wasteQty = (0, number_utils_1.scaleQuantity)(request.quantity) ?? 0;
        const remaining = batch.quantityRemaining ?? 0;
        if (remaining < wasteQty) {
            throw new common_1.BadRequestException("Batch does not have enough quantity");
        }
        batch.quantityRemaining = (0, number_utils_1.scaleQuantity)(remaining - wasteQty);
        await batch.save();
        const currentQty = product.quantity ?? 0;
        const newQuantity = currentQty - wasteQty;
        if (newQuantity < 0) {
            throw new common_1.BadRequestException("Stock quantity cannot be negative");
        }
        product.quantity = (0, number_utils_1.scaleQuantity)(newQuantity);
        const saved = await product.save();
        await this.stockMovementModel.create({
            productId: id,
            delta: -wasteQty,
            reason: request.reason,
            batchId: batch.id,
            supplierId: batch.supplierId,
            unitCost: batch.unitCost ?? null,
            note: request.note ?? null,
            performedBy,
            createdAt: new Date(),
        });
        return this.toResponse(saved);
    }
    async adjustStock(id, request, performedBy) {
        if (request.reason === stock_movement_reason_enum_1.StockMovementReason.RECEIVE) {
            return this.applyStockMovement(id, request.quantity, request.reason, request.note ?? null, performedBy, true);
        }
        if (request.reason === stock_movement_reason_enum_1.StockMovementReason.WASTE ||
            request.reason === stock_movement_reason_enum_1.StockMovementReason.SPOILAGE) {
            return this.applyStockMovement(id, request.quantity, request.reason, request.note ?? null, performedBy, false);
        }
        return this.applyStockMovement(id, request.quantity, request.reason, request.note ?? null, performedBy, request.increase);
    }
    async getStockMovements(id, page = 0, size = 20) {
        const total = await this.stockMovementModel.countDocuments({
            productId: id,
        });
        const movements = await this.stockMovementModel
            .find({ productId: id })
            .sort({ createdAt: -1 })
            .skip(page * size)
            .limit(size)
            .exec();
        return {
            content: movements.map((movement) => this.toMovementResponse(movement)),
            totalElements: total,
            totalPages: Math.ceil(total / size),
            number: page,
            size,
        };
    }
    async getBatches(id, availableOnly) {
        const query = availableOnly
            ? { productId: id, quantityRemaining: { $gt: 0 } }
            : { productId: id };
        const batches = await this.inventoryBatchModel
            .find(query)
            .sort({ receivedAt: -1 })
            .exec();
        const suppliers = await this.supplierModel.find().exec();
        const supplierMap = new Map(suppliers.map((supplier) => [supplier.id, supplier]));
        return batches.map((batch) => ({
            id: batch.id,
            productId: batch.productId,
            supplierId: batch.supplierId,
            supplierName: supplierMap.get(batch.supplierId)?.name ?? null,
            lotNumber: batch.lotNumber ?? null,
            expiryDate: batch.expiryDate ? batch.expiryDate.toISOString() : null,
            unitCost: batch.unitCost ?? null,
            quantityReceived: batch.quantityReceived ?? null,
            quantityRemaining: batch.quantityRemaining ?? null,
            receivedAt: batch.receivedAt ? batch.receivedAt.toISOString() : null,
            note: batch.note ?? null,
        }));
    }
    async getAll(page = 0, size = 20, sortBy = "name", sortDir = "asc", name, categoryId, supplierId) {
        const nameValue = name?.trim() ?? "";
        const hasName = nameValue !== "";
        const hasCategory = !!categoryId && categoryId.trim() !== "";
        const hasSupplier = !!supplierId && supplierId.trim() !== "";
        if (hasSupplier) {
            const links = await this.productSupplierModel.find({ supplierId }).exec();
            const productIds = Array.from(new Set(links.map((link) => link.productId)));
            if (productIds.length === 0) {
                return {
                    content: [],
                    totalElements: 0,
                    totalPages: 0,
                    number: page,
                    size,
                };
            }
            const products = await this.productModel
                .find({ _id: { $in: productIds } })
                .exec();
            const filtered = products
                .filter((product) => !hasName ||
                product.name.toLowerCase().includes(nameValue.toLowerCase()))
                .filter((product) => !hasCategory || product.categoryId === categoryId);
            const start = page * size;
            const end = Math.min(start + size, filtered.length);
            const content = start >= filtered.length ? [] : filtered.slice(start, end);
            return {
                content: content.map((product) => this.toResponse(product)),
                totalElements: filtered.length,
                totalPages: Math.ceil(filtered.length / size),
                number: page,
                size,
            };
        }
        const query = {};
        if (hasName) {
            query.name = { $regex: nameValue, $options: "i" };
        }
        if (hasCategory) {
            query.categoryId = categoryId;
        }
        const direction = sortDir?.toLowerCase() === "desc" ? -1 : 1;
        const total = await this.productModel.countDocuments(query);
        const products = await this.productModel
            .find(query)
            .sort({ [sortBy]: direction })
            .skip(page * size)
            .limit(size)
            .exec();
        return {
            content: products.map((product) => this.toResponse(product)),
            totalElements: total,
            totalPages: Math.ceil(total / size),
            number: page,
            size,
        };
    }
    async getLowStockAlerts() {
        const categories = await this.categoryModel.find().exec();
        const categoryMap = new Map(categories.map((category) => [category.id, category]));
        const now = new Date();
        const products = await this.productModel.find().exec();
        return products
            .filter((product) => this.isLowStock(product, categoryMap, now))
            .map((product) => this.toResponse(product));
    }
    async getReorderList() {
        const categories = await this.categoryModel.find().exec();
        const categoryMap = new Map(categories.map((category) => [category.id, category]));
        const now = new Date();
        const products = await this.productModel.find().exec();
        return products
            .filter((product) => this.isLowStock(product, categoryMap, now))
            .map((product) => {
            const threshold = this.resolveThreshold(product, categoryMap);
            const currentQty = product.quantity ?? 0;
            let suggested = threshold ? threshold - currentQty : 0;
            if (suggested < 0) {
                suggested = 0;
            }
            return {
                id: product.id,
                name: product.name,
                categoryId: product.categoryId,
                unit: product.unit,
                quantity: product.quantity ?? null,
                lowStockThreshold: threshold ?? null,
                suggestedOrderQuantity: (0, number_utils_1.scaleQuantity)(suggested) ?? 0,
            };
        });
    }
    async snoozeLowStock(id, until) {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new common_1.NotFoundException("Product not found");
        }
        product.lowStockSnoozedUntil = until;
        await product.save();
    }
    async bulkUpdateCategory(request) {
        await this.ensureCategoryExists(request.categoryId);
        const products = await this.productModel
            .find({ _id: { $in: request.productIds } })
            .exec();
        for (const product of products) {
            if (product.categoryId !== request.categoryId) {
                await this.ensureDuplicateProduct(product.name, request.categoryId, product.id);
                product.categoryId = request.categoryId;
            }
        }
        if (products.length > 0) {
            await this.productModel.bulkSave(products);
        }
    }
    async bulkUpdatePrice(request) {
        const price = (0, number_utils_1.scalePrice)(request.price);
        await this.productModel.updateMany({ _id: { $in: request.productIds } }, { $set: { price } });
    }
    async importCsv(file) {
        if (!file || !file.buffer || file.buffer.length === 0) {
            throw new common_1.BadRequestException("CSV file is required");
        }
        const records = (0, sync_1.parse)(file.buffer, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });
        let created = 0;
        let updated = 0;
        let skipped = 0;
        for (const record of records) {
            const name = this.safeValue(record, "name");
            const barcode = this.normalizeBarcode(this.safeValue(record, "barcode"));
            const categoryId = this.safeValue(record, "categoryId");
            const primarySupplierId = this.safeValue(record, "primarySupplierId");
            const unitRaw = this.safeValue(record, "unit");
            const price = this.parseNumber(record, "price");
            if (!name ||
                !categoryId ||
                !unitRaw ||
                !primarySupplierId ||
                price === null) {
                skipped++;
                continue;
            }
            const category = await this.ensureCategoryExists(categoryId);
            const supplier = await this.ensureSupplierExists(primarySupplierId);
            let product = await this.resolveExistingProduct(name, categoryId, barcode);
            const isNew = !product;
            if (!product) {
                product = new this.productModel();
            }
            product.name = name.trim();
            product.barcode = barcode;
            product.categoryId = categoryId;
            product.primarySupplierId = primarySupplierId;
            product.unit = this.parseUnit(unitRaw);
            product.costPrice = (0, number_utils_1.scalePrice)(this.parseNumber(record, "costPrice"));
            const scaledPrice = (0, number_utils_1.scalePrice)(price);
            if (scaledPrice === null) {
                throw new common_1.BadRequestException("Price is required");
            }
            product.price = scaledPrice;
            product.quantity = (0, number_utils_1.scaleQuantity)(this.parseNumber(record, "quantity") ?? 0);
            product.imageUrl = this.safeValue(record, "imageUrl");
            product.notes = this.safeValue(record, "notes");
            let threshold = this.parseNumber(record, "lowStockThreshold");
            if (threshold === null &&
                category.defaultLowStockThreshold !== undefined) {
                threshold = category.defaultLowStockThreshold ?? null;
            }
            product.lowStockThreshold = (0, number_utils_1.scaleThreshold)(threshold);
            const saved = await product.save();
            await this.upsertProductSupplier(saved.id, supplier, saved.costPrice ?? null, saved.notes ?? null, "import");
            if (isNew) {
                created++;
            }
            else {
                updated++;
            }
        }
        return { created, updated, skipped };
    }
    async applyStockMovement(productId, quantity, reason, note, performedBy, increase) {
        const product = await this.productModel.findById(productId).exec();
        if (!product) {
            throw new common_1.NotFoundException("Product not found");
        }
        let delta = (0, number_utils_1.scaleQuantity)(quantity) ?? 0;
        if (!increase) {
            delta = -delta;
        }
        const currentQty = product.quantity ?? 0;
        const newQuantity = currentQty + delta;
        if (newQuantity < 0) {
            throw new common_1.BadRequestException("Stock quantity cannot be negative");
        }
        product.quantity = (0, number_utils_1.scaleQuantity)(newQuantity);
        const saved = await product.save();
        await this.stockMovementModel.create({
            productId,
            delta,
            reason,
            batchId: null,
            supplierId: null,
            unitCost: null,
            note: note ?? null,
            performedBy,
            createdAt: new Date(),
        });
        return this.toResponse(saved);
    }
    async ensureCategoryExists(categoryId) {
        const category = await this.categoryModel.findById(categoryId).exec();
        if (!category) {
            throw new common_1.NotFoundException("Category not found");
        }
        return category;
    }
    async ensureSupplierExists(supplierId) {
        if (!supplierId || supplierId.trim() === "") {
            throw new common_1.BadRequestException("Supplier is required");
        }
        const supplier = await this.supplierModel.findById(supplierId).exec();
        if (!supplier) {
            throw new common_1.NotFoundException("Supplier not found");
        }
        return supplier;
    }
    async ensureDuplicateProduct(name, categoryId, currentProductId) {
        const existing = await this.productModel
            .findOne({ name: new RegExp(`^${name}$`, "i"), categoryId })
            .exec();
        if (!existing) {
            return;
        }
        if (!currentProductId || existing.id !== currentProductId) {
            throw new common_1.BadRequestException("A product with the same name already exists in this category");
        }
    }
    async ensureBarcodeUnique(barcode, currentProductId) {
        if (!barcode) {
            return;
        }
        const existing = await this.productModel.findOne({ barcode }).exec();
        if (existing && (!currentProductId || existing.id !== currentProductId)) {
            throw new common_1.BadRequestException("Barcode already assigned to another product");
        }
    }
    normalizeBarcode(barcode) {
        if (barcode === null || barcode === undefined) {
            return null;
        }
        const trimmed = barcode.trim();
        return trimmed === "" ? null : trimmed;
    }
    toResponse(product) {
        return {
            id: product.id,
            name: product.name,
            barcode: product.barcode ?? null,
            categoryId: product.categoryId,
            primarySupplierId: product.primarySupplierId,
            costPrice: product.costPrice ?? null,
            price: product.price,
            quantity: product.quantity ?? null,
            unit: product.unit,
            imageUrl: product.imageUrl ?? null,
            notes: product.notes ?? null,
            lowStockThreshold: product.lowStockThreshold ?? null,
            lowStockSnoozedUntil: product.lowStockSnoozedUntil
                ? product.lowStockSnoozedUntil.toISOString()
                : null,
        };
    }
    toMovementResponse(movement) {
        return {
            id: movement.id,
            productId: movement.productId,
            delta: movement.delta,
            reason: movement.reason,
            batchId: movement.batchId ?? null,
            supplierId: movement.supplierId ?? null,
            unitCost: movement.unitCost ?? null,
            note: movement.note ?? null,
            performedBy: movement.performedBy ?? null,
            createdAt: movement.createdAt ? movement.createdAt.toISOString() : null,
        };
    }
    isLowStock(product, categoryMap, now) {
        if (product.lowStockSnoozedUntil && product.lowStockSnoozedUntil > now) {
            return false;
        }
        const threshold = this.resolveThreshold(product, categoryMap);
        if (threshold === null || threshold === undefined) {
            return false;
        }
        const currentQty = product.quantity ?? 0;
        return currentQty < threshold;
    }
    resolveThreshold(product, categoryMap) {
        if (product.lowStockThreshold !== null &&
            product.lowStockThreshold !== undefined) {
            return product.lowStockThreshold;
        }
        const category = categoryMap.get(product.categoryId);
        return category?.defaultLowStockThreshold ?? null;
    }
    async upsertProductSupplier(productId, supplier, price, note, updatedBy) {
        if (!supplier) {
            return;
        }
        const existing = await this.productSupplierModel
            .findOne({ productId, supplierId: supplier.id })
            .exec();
        const scaledPrice = price === null || price === undefined ? null : (0, number_utils_1.scalePrice)(price);
        const priceChanged = scaledPrice !== null &&
            (!existing ||
                existing.negotiatedPrice === null ||
                existing.negotiatedPrice === undefined ||
                Number(existing.negotiatedPrice) !== Number(scaledPrice));
        const doc = existing ?? new this.productSupplierModel();
        doc.productId = productId;
        doc.supplierId = supplier.id;
        doc.negotiatedPrice = scaledPrice;
        doc.note = note ?? null;
        doc.updatedAt = new Date();
        const saved = await doc.save();
        if (priceChanged) {
            await this.productSupplierHistoryModel.create({
                productId: saved.productId,
                supplierId: saved.supplierId,
                negotiatedPrice: saved.negotiatedPrice,
                note: note ?? null,
                updatedBy,
                effectiveAt: new Date(),
            });
        }
    }
    safeValue(record, key) {
        if (record && Object.prototype.hasOwnProperty.call(record, key)) {
            const value = record[key];
            if (value === undefined || value === null) {
                return null;
            }
            const trimmed = String(value).trim();
            return trimmed === "" ? null : trimmed;
        }
        return null;
    }
    parseNumber(record, key) {
        const value = this.safeValue(record, key);
        if (value === null) {
            return null;
        }
        const parsed = Number(value);
        if (Number.isNaN(parsed)) {
            return null;
        }
        return parsed;
    }
    async resolveExistingProduct(name, categoryId, barcode) {
        if (barcode) {
            return this.productModel.findOne({ barcode }).exec();
        }
        return this.productModel
            .findOne({ name: new RegExp(`^${name}$`, "i"), categoryId })
            .exec();
    }
    parseUnit(value) {
        const normalized = value.trim().toUpperCase();
        if (!this.isUnit(normalized)) {
            throw new common_1.BadRequestException(`Invalid unit: ${value}`);
        }
        return normalized;
    }
    isUnit(value) {
        const unitValues = Object.values(unit_enum_1.Unit);
        return unitValues.includes(value);
    }
    async generateNextBatchNumber(productId) {
        const latest = await this.inventoryBatchModel
            .findOne({ productId })
            .sort({ receivedAt: -1 })
            .exec();
        const current = latest?.lotNumber
            ? this.parseLotNumber(latest.lotNumber)
            : null;
        if (current === null) {
            return "1";
        }
        return String(current + 1);
    }
    parseLotNumber(value) {
        if (!value) {
            return null;
        }
        const trimmed = value.trim();
        if (!trimmed) {
            return null;
        }
        const parsed = Number(trimmed);
        if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
            return null;
        }
        return Math.trunc(parsed);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __param(2, (0, mongoose_1.InjectModel)(supplier_schema_1.Supplier.name)),
    __param(3, (0, mongoose_1.InjectModel)(product_supplier_schema_1.ProductSupplier.name)),
    __param(4, (0, mongoose_1.InjectModel)(product_supplier_history_schema_1.ProductSupplierHistory.name)),
    __param(5, (0, mongoose_1.InjectModel)(inventory_batch_schema_1.InventoryBatch.name)),
    __param(6, (0, mongoose_1.InjectModel)(stock_movement_schema_1.StockMovement.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map