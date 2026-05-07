import { Model } from 'mongoose';
import { Supplier } from '../schemas/supplier.schema';
import { SupplierCreateDto } from './dto/supplier-create.dto';
import { SupplierUpdateDto } from './dto/supplier-update.dto';
import { SupplierResponseDto } from './dto/supplier-response.dto';
export declare class SuppliersService {
    private readonly supplierModel;
    constructor(supplierModel: Model<Supplier>);
    create(request: SupplierCreateDto): Promise<SupplierResponseDto>;
    update(id: string, request: SupplierUpdateDto): Promise<SupplierResponseDto>;
    delete(id: string): Promise<void>;
    getById(id: string): Promise<SupplierResponseDto>;
    getAll(): Promise<SupplierResponseDto[]>;
    private toResponse;
}
