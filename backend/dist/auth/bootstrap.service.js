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
exports.BootstrapService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("./auth.service");
const roles_enum_1 = require("./roles.enum");
let BootstrapService = class BootstrapService {
    authService;
    configService;
    constructor(authService, configService) {
        this.authService = authService;
        this.configService = configService;
    }
    async onModuleInit() {
        await this.authService.ensureBootstrapUser(this.configService.get('BOOTSTRAP_ADMIN_USERNAME') ?? 'admin', this.configService.get('BOOTSTRAP_ADMIN_PASSWORD') ?? 'admin12345', [roles_enum_1.Role.ADMIN]);
        await this.authService.ensureBootstrapUser(this.configService.get('BOOTSTRAP_STAFF_USERNAME') ?? 'staff', this.configService.get('BOOTSTRAP_STAFF_PASSWORD') ?? 'staff12345', [roles_enum_1.Role.STAFF]);
    }
};
exports.BootstrapService = BootstrapService;
exports.BootstrapService = BootstrapService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        config_1.ConfigService])
], BootstrapService);
//# sourceMappingURL=bootstrap.service.js.map