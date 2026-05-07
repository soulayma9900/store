import { SuppliersService } from './suppliers.service';
import { SupplierCreateDto } from './dto/supplier-create.dto';
import { SupplierUpdateDto } from './dto/supplier-update.dto';
import { SupplierResponseDto } from './dto/supplier-response.dto';
export declare class SuppliersController {
    private readonly suppliersService;
    constructor(suppliersService: SuppliersService);
    create(request: SupplierCreateDto): Promise<SupplierResponseDto>;
    update(id: string, request: SupplierUpdateDto): Promise<SupplierResponseDto>;
    delete(id: string): Promise<void>;
    getById(id: string): Promise<SupplierResponseDto>;
    getAll(): Promise<SupplierResponseDto[]>;
}
