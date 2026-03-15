package com.hyundai.dms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DealerPerformanceDTO {

    private Long dealerId;
    private String dealerName;

    private Long totalEmployees;
    private Long totalLeads;
    private Long totalBookings;

    private double conversionRate;
    private boolean active;

}