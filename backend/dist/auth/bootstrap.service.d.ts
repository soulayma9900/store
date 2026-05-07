import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
export declare class BootstrapService implements OnModuleInit {
    private readonly authService;
    private readonly configService;
    constructor(authService: AuthService, configService: ConfigService);
    onModuleInit(): Promise<void>;
}
