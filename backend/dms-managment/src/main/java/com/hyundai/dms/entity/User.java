package com.hyundai.dms.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.hyundai.dms.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Central auth entity — single source of truth for all user credentials.
 * Admin, Dealer, Employee all log in through this table.
 * Profile-specific data lives in their respective profile tables (admins, dealers, employees).
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password;

    // Primary system role — drives JWT claim and Spring Security ROLE_*
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole systemRole;

    @Column(nullable = false)
    private Boolean active;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
