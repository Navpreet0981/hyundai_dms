package com.hyundai.dms.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Role management table — stores the 3 system roles with descriptions.
 * Currently: ADMIN, DEALER, EMPLOYEE.
 * Schema is designed to support additional roles in future without changes.
 */
@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roleId;

    // e.g. ADMIN, DEALER, EMPLOYEE
    @Column(unique = true, nullable = false)
    private String roleName;

    // Human-readable label shown in UI
    @Column(nullable = false)
    private String displayName;

    private String description;

    @Column(nullable = false)
    private Boolean active;
}
