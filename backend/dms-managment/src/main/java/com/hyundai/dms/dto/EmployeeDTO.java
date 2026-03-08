package com.hyundai.dms.dto;

import com.hyundai.dms.enums.EmployeeRole;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmployeeDTO {

    private String name;
    private String email;
    private String phone;
    private EmployeeRole role;
    private Long dealerId;
}