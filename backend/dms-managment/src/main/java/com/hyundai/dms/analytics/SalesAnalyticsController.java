package com.hyundai.dms.analytics;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/sales")
public class SalesAnalyticsController {

    private final SalesAnalyticsService salesAnalyticsService;

    public SalesAnalyticsController(SalesAnalyticsService salesAnalyticsService) {
        this.salesAnalyticsService = salesAnalyticsService;
    }

    @GetMapping("/monthly")
    public List<SalesAnalyticsDTO> getMonthlySales() {
        return salesAnalyticsService.getMonthlySales();
    }

    @GetMapping("/yearly")
    public List<SalesAnalyticsDTO> getYearlySales() {
        return salesAnalyticsService.getYearlySales();
    }
}