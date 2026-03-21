package com.hyundai.dms.controller;

import com.hyundai.dms.dto.SalesAnalyticsDTO;
import com.hyundai.dms.service.SalesAnalyticsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class SalesAnalyticsController {

    private final SalesAnalyticsService salesAnalyticsService;

    public SalesAnalyticsController(SalesAnalyticsService salesAnalyticsService) {
        this.salesAnalyticsService = salesAnalyticsService;
    }

    // ADMIN ANALYTICS

    @GetMapping("/admin/sales/monthly")
    public List<SalesAnalyticsDTO> getMonthlySales() {
        return salesAnalyticsService.getMonthlySales();
    }

    @GetMapping("/admin/sales/yearly")
    public List<SalesAnalyticsDTO> getYearlySales() {
        return salesAnalyticsService.getYearlySales();
    }

    // NEW: SALES PER DEALER
    @GetMapping("/admin/sales/dealers")
    public List<Map<String,Object>> getSalesPerDealer(){
        return salesAnalyticsService.getSalesPerDealer();
    }

    // NEW: SALES SUMMARY
    @GetMapping("/admin/sales/summary")
    public Map<String,Object> getSalesSummary(){
        return salesAnalyticsService.getSalesSummary();
    }

//    @GetMapping("/admin/sales/summary")
//    public AdminSalesSummaryDTO getAdminSummary(){
//        return salesAnalyticsService.getAdminSummary();
//    }

    // EMPLOYEE ANALYTICS
    @GetMapping("/employee/sales/monthly")
    public List<SalesAnalyticsDTO> getEmployeeMonthlySales() {
        return salesAnalyticsService.getMonthlySales();
    }
}