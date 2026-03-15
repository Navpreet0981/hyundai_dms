package com.hyundai.dms.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ServiceRequestDTO {

    private Long serviceRequestId;

    private LocalDate serviceDate;

    private String issueDescription;

    private String status;

    private Long customerId;
    private Long dealerId;
    private Long variantId;

    private String customerName;
    private String variantName;
    private String dealerName;

}