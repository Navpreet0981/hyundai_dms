package com.hyundai.dms.analytics;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashboardDTO {

    private long totalDealers;
    private long totalEmployees;
    private long totalCustomers;
    private long totalBookings;
    private double leadConversionRate;
}