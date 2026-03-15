package com.hyundai.dms.controller;

import com.hyundai.dms.dto.DealerDashboardDTO;
import com.hyundai.dms.repository.DealerDashboardService;
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