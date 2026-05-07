import { SalesService } from "./sales.service";
import { SaleCreateDto } from "./dto/sale-create.dto";
import { SaleResponseDto } from "./dto/sale-response.dto";
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(request: SaleCreateDto, req: {
        user?: {
            username?: string;
        };
    }): Promise<SaleResponseDto>;
    getAll(page?: string, size?: string, productId?: string): Promise<{
        content: SaleResponseDto[];
        totalElements: number;
        totalPages: number;
        number: number;
        size: number;
    }>;
}
