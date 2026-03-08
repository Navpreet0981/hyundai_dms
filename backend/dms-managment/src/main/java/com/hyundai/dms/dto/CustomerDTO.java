package com.hyundai.dms.dto;

import com.hyundai.dms.enums.LeadStatus;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDTO {

    private Long customerId;

    private String name;

    private String phone;

    private String email;

    private String city;

    private String leadSource;

    private String interestedModel;

    private LeadStatus leadStatus;

    private LocalDate createdDate;

    private Long dealerId;

    private Long employeeId;
}