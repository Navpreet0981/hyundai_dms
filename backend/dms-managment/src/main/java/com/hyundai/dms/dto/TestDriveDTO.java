package com.hyundai.dms.dto;

import com.hyundai.dms.enums.TestDriveStatus;
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

    private TestDriveStatus status;

    private Long customerId;

    private Long dealerId;

    private Long employeeId;

    private Long variantId;
}