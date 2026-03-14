package com.hyundai.dms.analytics;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DealerDashboardDTO {

    private String dealerName;

    private long totalEmployees;

    private long totalLeads;

    private long totalTestDrives;

    private long totalBookings;

    private double conversionRate;
}