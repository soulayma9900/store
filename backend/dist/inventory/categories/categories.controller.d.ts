import { CategoriesService } from './categories.service';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(request: CategoryCreateDto): Promise<CategoryResponseDto>;
    update(id: string, request: CategoryUpdateDto): Promise<CategoryResponseDto>;
    delete(id: string): Promise<void>;
    getById(id: string): Promise<CategoryResponseDto>;
    getAll(): Promise<CategoryResponseDto[]>;
}
