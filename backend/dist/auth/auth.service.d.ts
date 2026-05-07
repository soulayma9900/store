import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { AppUser } from './schemas/user.schema';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { Role } from './roles.enum';
export declare class AuthService {
    private readonly userModel;
    private readonly jwtService;
    private readonly configService;
    constructor(userModel: Model<AppUser>, jwtService: JwtService, configService: ConfigService);
    login(request: LoginRequestDto): Promise<LoginResponseDto>;
    findByUsername(username: string): Promise<AppUser | null>;
    ensureBootstrapUser(username: string, password: string, roles: Role[]): Promise<void>;
}
