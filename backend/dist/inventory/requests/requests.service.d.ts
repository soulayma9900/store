import { Model } from 'mongoose';
import { ActionRequest } from '../schemas/action-request.schema';
import { RequestType } from './enums/request-type.enum';
import { RequestStatus } from './enums/request-status.enum';
import { RestockRequestDto } from './dto/restock-request.dto';
import { DamageReportDto } from './dto/damage-report.dto';
import { ProductSuggestionDto } from './dto/product-suggestion.dto';
import { ProductNoteDto } from './dto/product-note.dto';
import { RequestResponseDto } from './dto/request-response.dto';
import { ProductsService } from '../products/products.service';
import { Product } from '../schemas/product.schema';
interface PageResult<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}
export declare class RequestsService {
    private readonly requestModel;
    private readonly productModel;
    private readonly productsService;
    constructor(requestModel: Model<ActionRequest>, productModel: Model<Product>, productsService: ProductsService);
    createRestockRequest(request: RestockRequestDto, createdBy: string): Promise<RequestResponseDto>;
    createDamageReport(request: DamageReportDto, createdBy: string): Promise<RequestResponseDto>;
    createProductSuggestion(request: ProductSuggestionDto, createdBy: string): Promise<RequestResponseDto>;
    createProductNote(request: ProductNoteDto, createdBy: string): Promise<RequestResponseDto>;
    getAll(page: number, size: number, filters: {
        status?: RequestStatus;
        type?: RequestType;
        productId?: string;
    }, createdBy: string, isAdmin: boolean): Promise<PageResult<RequestResponseDto>>;
    submitRequest(id: string, submittedBy: string, isAdmin: boolean): Promise<RequestResponseDto>;
    approveRequest(id: string, reviewedBy: string, reviewNote?: string | null): Promise<RequestResponseDto>;
    rejectRequest(id: string, reviewedBy: string, reviewNote?: string | null): Promise<RequestResponseDto>;
    private createRequest;
    private ensureProductExists;
    private findRequestForUser;
    private getPayload;
    private applyApproval;
    private applyRestock;
    private applyDamageReport;
    private applyProductSuggestion;
    private applyProductNote;
    private toResponse;
}
export {};
