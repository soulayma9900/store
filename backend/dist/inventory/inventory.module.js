"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const products_controller_1 = require("./products/products.controller");
const products_service_1 = require("./products/products.service");
const categories_controller_1 = require("./categories/categories.controller");
const categories_service_1 = require("./categories/categories.service");
const suppliers_controller_1 = require("./suppliers/suppliers.controller");
const suppliers_service_1 = require("./suppliers/suppliers.service");
const product_suppliers_controller_1 = require("./product-suppliers/product-suppliers.controller");
const product_suppliers_service_1 = require("./product-suppliers/product-suppliers.service");
const product_schema_1 = require("./schemas/product.schema");
const category_schema_1 = require("./schemas/category.schema");
const supplier_schema_1 = require("./schemas/supplier.schema");
const product_supplier_schema_1 = require("./schemas/product-supplier.schema");
const product_supplier_history_schema_1 = require("./schemas/product-supplier-history.schema");
const inventory_batch_schema_1 = require("./schemas/inventory-batch.schema");
const stock_movement_schema_1 = require("./schemas/stock-movement.schema");
const sale_schema_1 = require("./schemas/sale.schema");
const sales_controller_1 = require("./sales/sales.controller");
const sales_service_1 = require("./sales/sales.service");
const action_request_schema_1 = require("./schemas/action-request.schema");
const requests_controller_1 = require("./requests/requests.controller");
const requests_service_1 = require("./requests/requests.service");
let InventoryModule = class InventoryModule {
};
exports.InventoryModule = InventoryModule;
exports.InventoryModule = InventoryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
                { name: category_schema_1.Category.name, schema: category_schema_1.CategorySchema },
                { name: supplier_schema_1.Supplier.name, schema: supplier_schema_1.SupplierSchema },
                { name: product_supplier_schema_1.ProductSupplier.name, schema: product_supplier_schema_1.ProductSupplierSchema },
                {
                    name: product_supplier_history_schema_1.ProductSupplierHistory.name,
                    schema: product_supplier_history_schema_1.ProductSupplierHistorySchema,
                },
                { name: inventory_batch_schema_1.InventoryBatch.name, schema: inventory_batch_schema_1.InventoryBatchSchema },
                { name: stock_movement_schema_1.StockMovement.name, schema: stock_movement_schema_1.StockMovementSchema },
                { name: sale_schema_1.Sale.name, schema: sale_schema_1.SaleSchema },
                { name: action_request_schema_1.ActionRequest.name, schema: action_request_schema_1.ActionRequestSchema },
            ]),
        ],
        controllers: [
            products_controller_1.ProductsController,
            categories_controller_1.CategoriesController,
            suppliers_controller_1.SuppliersController,
            product_suppliers_controller_1.ProductSuppliersController,
            sales_controller_1.SalesController,
            requests_controller_1.RequestsController,
        ],
        providers: [
            products_service_1.ProductsService,
            categories_service_1.CategoriesService,
            suppliers_service_1.SuppliersService,
            product_suppliers_service_1.ProductSuppliersService,
            sales_service_1.SalesService,
            requests_service_1.RequestsService,
        ],
    })
], InventoryModule);
//# sourceMappingURL=inventory.module.js.map