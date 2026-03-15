package com.hyundai.dms.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminSalesSummaryDTO {

    private Long totalBookings;
    private Long totalTestDrives;
    private Double totalRevenue;
    private Double conversionRate;

}