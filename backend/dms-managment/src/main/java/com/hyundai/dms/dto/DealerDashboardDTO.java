package com.hyundai.dms.dto;

import lombok.*;

// DTO returned by GET /dealer/dashboard — scoped stats for the logged-in dealer
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
    private double totalRevenue; // sum of variant prices across all dealer bookings
}