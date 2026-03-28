package com.hyundai.dms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Who performed the action
    @Column(nullable = false)
    private String actorEmail;

    @Column(nullable = false)
    private String actorRole;   // ADMIN, DEALER, EMPLOYEE

    // Optional: dealer context (null for admin actions)
    private Long dealerId;
    private String dealerName;

    // What happened
    @Column(nullable = false)
    private String action;      // LOGIN, LOGOUT, CREATE, UPDATE, DELETE

    @Column(nullable = false)
    private String entity;      // Customer, Employee, Booking, TestDrive, etc.

    private String entityId;    // ID of the affected record (nullable for login/logout)

    @Column(length = 500)
    private String description; // Human-readable summary

    @Column(nullable = false)
    private LocalDateTime timestamp;
}
