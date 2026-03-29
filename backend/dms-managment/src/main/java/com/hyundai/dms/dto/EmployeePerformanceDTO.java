package com.hyundai.dms.dto;

import lombok.*;

// DTO for per-employee performance stats returned by dealer performance endpoint
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeePerformanceDTO {

    private Long employeeId;
    private String employeeName;
    private long totalLeads;
    private long totalTestDrives;
    private long totalBookings;
    private double conversionRate;
}
