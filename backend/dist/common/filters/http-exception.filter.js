"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const isHttpException = exception instanceof common_1.HttpException;
        const status = isHttpException
            ? exception.getStatus()
            : common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Unexpected error';
        let error = common_1.HttpStatus[status];
        let fieldErrors = null;
        if (isHttpException) {
            const res = exception.getResponse();
            if (typeof res === 'string') {
                message = res;
            }
            else if (typeof res === 'object' && res !== null) {
                const payload = res;
                if (typeof payload.message === 'string') {
                    message = payload.message;
                }
                else if (Array.isArray(payload.message)) {
                    message = 'Validation failed';
                    fieldErrors = payload.message.map((msg) => ({
                        field: 'request',
                        message: String(msg),
                    }));
                }
                if (typeof payload.error === 'string') {
                    error = payload.error;
                }
            }
        }
        if (exception instanceof common_1.BadRequestException) {
            const res = exception.getResponse();
            if (Array.isArray(res?.message)) {
                message = 'Validation failed';
                fieldErrors = res.message.map((msg) => ({
                    field: 'request',
                    message: String(msg),
                }));
            }
        }
        const body = {
            timestamp: new Date().toISOString(),
            status,
            error,
            message,
            path: request.url,
            fieldErrors,
        };
        response.status(status).json(body);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)()
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map