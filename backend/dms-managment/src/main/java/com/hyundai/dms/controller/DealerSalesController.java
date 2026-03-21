package com.hyundai.dms.controller;

import com.hyundai.dms.dto.SalesAnalyticsDTO;
import com.hyundai.dms.security.util.CurrentUserUtil;
import com.hyundai.dms.service.SalesAnalyticsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dealer/revenue")
public class DealerSalesController {

    private final SalesAnalyticsService salesAnalyticsService;
    private final CurrentUserUtil currentUserUtil;

    public DealerSalesController(SalesAnalyticsService salesAnalyticsService,
                                 CurrentUserUtil currentUserUtil) {
        this.salesAnalyticsService = salesAnalyticsService;
        this.currentUserUtil = currentUserUtil;
    }

    @GetMapping("/monthly")
    public List<SalesAnalyticsDTO> getMonthlySales() {

        Long dealerId = currentUserUtil.getLoggedInDealerId();

        return salesAnalyticsService.getMonthlySalesByDealer(dealerId);
    }

    @GetMapping("/yearly")
    public List<SalesAnalyticsDTO> getYearlySales() {

        Long dealerId = currentUserUtil.getLoggedInDealerId();

        return salesAnalyticsService.getYearlySalesByDealer(dealerId);
    }
}