package com.hyundai.dms.service;

import com.hyundai.dms.dto.AdminSalesSummaryDTO;
import com.hyundai.dms.dto.SalesAnalyticsDTO;

import java.util.List;
import java.util.Map;

public interface SalesAnalyticsService {

    List<SalesAnalyticsDTO> getMonthlySales();

    List<SalesAnalyticsDTO> getYearlySales();

    List<SalesAnalyticsDTO> getMonthlySalesByDealer(Long dealerId);

    List<SalesAnalyticsDTO> getYearlySalesByDealer(Long dealerId);

    // NEW
    List<Map<String,Object>> getSalesPerDealer();

    Map<String,Object> getSalesSummary();
    AdminSalesSummaryDTO getAdminSummary();
}