package com.hyundai.dms.analytics;

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