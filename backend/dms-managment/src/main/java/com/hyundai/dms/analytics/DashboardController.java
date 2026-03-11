package com.hyundai.dms.analytics;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/dashboard")
    public DashboardDTO getDashboardStats() {
        return dashboardService.getDashboardStats();
    }
}