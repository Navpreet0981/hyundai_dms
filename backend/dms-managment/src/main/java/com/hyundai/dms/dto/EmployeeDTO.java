package com.hyundai.dms.dto;

import com.hyundai.dms.enums.EmployeeRole;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDTO {

    private Long employeeId;

    private String name;

    private String email;

    private String phone;

    private EmployeeRole role;

    // Dealer Info
    private Long dealerId;

    private String dealerName;

    private String dealerCity;

    private String dealerState;

}