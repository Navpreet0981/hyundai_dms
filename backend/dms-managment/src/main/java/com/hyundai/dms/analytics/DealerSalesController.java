package com.hyundai.dms.analytics;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dealer/sales")
public class DealerSalesController {

    private final SalesAnalyticsService salesAnalyticsService;

    public DealerSalesController(SalesAnalyticsService salesAnalyticsService) {
        this.salesAnalyticsService = salesAnalyticsService;
    }

    @GetMapping("/monthly/{dealerId}")
    public List<SalesAnalyticsDTO> getMonthlySales(@PathVariable Long dealerId) {
        return salesAnalyticsService.getMonthlySalesByDealer(dealerId);
    }

    @GetMapping("/yearly/{dealerId}")
    public List<SalesAnalyticsDTO> getYearlySales(@PathVariable Long dealerId) {
        return salesAnalyticsService.getYearlySalesByDealer(dealerId);
    }
}