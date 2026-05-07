import { Model } from 'mongoose';
import { Category } from '../schemas/category.schema';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { Product } from '../schemas/product.schema';
export declare class CategoriesService {
    private readonly categoryModel;
    private readonly productModel;
    constructor(categoryModel: Model<Category>, productModel: Model<Product>);
    create(request: CategoryCreateDto): Promise<CategoryResponseDto>;
    update(id: string, request: CategoryUpdateDto): Promise<CategoryResponseDto>;
    delete(id: string): Promise<void>;
    getById(id: string): Promise<CategoryResponseDto>;
    getAll(): Promise<CategoryResponseDto[]>;
    private toResponse;
}
