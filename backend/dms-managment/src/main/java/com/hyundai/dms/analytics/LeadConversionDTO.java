package com.hyundai.dms.analytics;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LeadConversionDTO {

    private long totalLeads;
    private long totalTestDrives;
    private long totalBookings;

    private double leadToTestDriveRate;
    private double leadToBookingRate;
    private double testDriveToBookingRate;
}