package com.hyundai.dms.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.hyundai.dms.enums.EmployeeRole;
import com.hyundai.dms.enums.EmployeeStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long employeeId;

    private String name;
    private String email;
    private String phone;

    // WRITE_ONLY: never returned in API responses, but readable by Java code
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Enumerated(EnumType.STRING)
    private EmployeeRole role;

    private Boolean active;

    @ManyToOne
    @JoinColumn(name = "dealer_id")
    private Dealer dealer;

    @Enumerated(EnumType.STRING)
    private EmployeeStatus status;
}
