package com.hyundai.dms.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.hyundai.dms.enums.EmployeeRole;
import com.hyundai.dms.enums.EmployeeStatus;
import jakarta.persistence.*;
import lombok.*;

/**
 * Employee profile table — stores employee-specific data.
 * Auth credentials (email, password) live in the users table.
 * One-to-one with User where user.systemRole = EMPLOYEE.
 * Hierarchy: dealer → which dealership this employee belongs to.
 */
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

    // Link to the central auth user (this employee's login account)
    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    @JsonIgnoreProperties({"password", "createdAt", "updatedAt"})
    private User user;

    // Which dealer this employee works under — core hierarchy link
    @ManyToOne
    @JoinColumn(name = "dealer_id", nullable = false)
    private Dealer dealer;

    // Sub-role within the employee system role
    @Enumerated(EnumType.STRING)
    private EmployeeRole role;

    @Enumerated(EnumType.STRING)
    private EmployeeStatus status;

    // Convenience delegates to user — keeps existing code working
    @Transient
    public String getName() {
        return user != null ? user.getName() : null;
    }

    @Transient
    public String getEmail() {
        return user != null ? user.getEmail() : null;
    }

    @Transient
    public Boolean getActive() {
        return user != null ? user.getActive() : null;
    }
}
