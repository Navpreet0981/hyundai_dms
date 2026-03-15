package com.hyundai.dms.controller;

import com.hyundai.dms.dto.DashboardDTO;
import com.hyundai.dms.dto.DealerPerformanceDTO;
import com.hyundai.dms.repository.DashboardService;
import com.hyundai.dms.service.DealerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class DashboardController {

    private final DashboardService dashboardService;
    private final DealerService dealerService;

    public DashboardController(DashboardService dashboardService, DealerService dealerService) {
        this.dashboardService = dashboardService;
        this.dealerService = dealerService;
    }

    @GetMapping("/dashboard")
    public DashboardDTO getDashboardStats() {
        return dashboardService.getDashboardStats();
    }

    @GetMapping("/dealer-performance")
    public List<DealerPerformanceDTO> getDealerPerformance(){
        return dealerService.getDealerPerformance();
    }
}