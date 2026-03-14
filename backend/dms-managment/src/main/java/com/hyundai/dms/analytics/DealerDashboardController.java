package com.hyundai.dms.analytics;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dealer")
public class DealerDashboardController {

    private final DealerDashboardService dealerDashboardService;

    public DealerDashboardController(DealerDashboardService dealerDashboardService) {
        this.dealerDashboardService = dealerDashboardService;
    }

    @GetMapping("/dashboard/{dealerId}")
    public DealerDashboardDTO getDealerDashboard(@PathVariable Long dealerId) {

        return dealerDashboardService.getDealerDashboard(dealerId);
    }
}