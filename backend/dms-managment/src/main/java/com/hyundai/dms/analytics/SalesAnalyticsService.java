package com.hyundai.dms.analytics;

import java.util.List;

public interface SalesAnalyticsService {

    List<SalesAnalyticsDTO> getMonthlySales();

    List<SalesAnalyticsDTO> getYearlySales();

    List<SalesAnalyticsDTO> getMonthlySalesByDealer(Long dealerId);

    List<SalesAnalyticsDTO> getYearlySalesByDealer(Long dealerId);
}