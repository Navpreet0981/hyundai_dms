package com.hyundai.dms.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class TestDriveDTO {

    private Long testDriveId;

    private LocalDate testDriveDate;

    private String status;

    private Long customerId;
    private Long dealerId;
    private Long employeeId;
    private Long variantId;

    private String customerName;
    private String variantName;
    private String dealerName;
    private String employeeName;

}