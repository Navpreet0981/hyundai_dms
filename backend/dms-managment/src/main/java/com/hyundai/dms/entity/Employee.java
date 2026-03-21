package com.hyundai.dms.entity;

import com.hyundai.dms.enums.EmployeeStatus;
import jakarta.persistence.*;
import lombok.*;
import com.hyundai.dms.enums.EmployeeRole;
@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    private String password;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long employeeId;

    private String name;

    private String email;

    private String phone;

    @Enumerated(EnumType.STRING)
    private EmployeeRole role;

    private Boolean active;

    @ManyToOne
    @JoinColumn(name = "dealer_id")
    private Dealer dealer;

    @Enumerated(EnumType.STRING)
    private EmployeeStatus status;
}