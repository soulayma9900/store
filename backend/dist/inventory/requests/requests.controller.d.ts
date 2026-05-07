import { Role } from '../../auth/roles.enum';
import { RequestsService } from './requests.service';
import { RestockRequestDto } from './dto/restock-request.dto';
import { DamageReportDto } from './dto/damage-report.dto';
import { ProductSuggestionDto } from './dto/product-suggestion.dto';
import { ProductNoteDto } from './dto/product-note.dto';
import { RequestReviewDto } from './dto/request-review.dto';
import { RequestResponseDto } from './dto/request-response.dto';
import { RequestStatus } from './enums/request-status.enum';
import { RequestType } from './enums/request-type.enum';
export declare class RequestsController {
    private readonly requestsService;
    constructor(requestsService: RequestsService);
    createRestock(request: RestockRequestDto, req: {
        user?: {
            username?: string;
        };
    }): Promise<RequestResponseDto>;
    createDamage(request: DamageReportDto, req: {
        user?: {
            username?: string;
        };
    }): Promise<RequestResponseDto>;
    createProductSuggestion(request: ProductSuggestionDto, req: {
        user?: {
            username?: string;
        };
    }): Promise<RequestResponseDto>;
    createProductNote(request: ProductNoteDto, req: {
        user?: {
            username?: string;
        };
    }): Promise<RequestResponseDto>;
    getAll(page?: string, size?: string, status?: RequestStatus, type?: RequestType, productId?: string, req?: {
        user?: {
            username?: string;
            roles?: Role[];
        };
    }): Promise<{
        content: RequestResponseDto[];
        totalElements: number;
        totalPages: number;
        number: number;
        size: number;
    }>;
    submit(id: string, req: {
        user?: {
            username?: string;
            roles?: Role[];
        };
    }): Promise<RequestResponseDto>;
    approve(id: string, review: RequestReviewDto, req: {
        user?: {
            username?: string;
        };
    }): Promise<RequestResponseDto>;
    reject(id: string, review: RequestReviewDto, req: {
        user?: {
            username?: string;
        };
    }): Promise<RequestResponseDto>;
}
