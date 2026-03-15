package com.hyundai.dms.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SalesAnalyticsDTO {

    private String period;
    private long totalBookings;
}