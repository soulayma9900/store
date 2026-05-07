import { DashboardService } from "./dashboard.service";
import { DashboardResponseDto } from "./dashboard.dto";
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboard(): Promise<DashboardResponseDto>;
}
