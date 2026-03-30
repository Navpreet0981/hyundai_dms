package com.hyundai.dms.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * Admin profile table — stores admin-specific metadata.
 * Auth credentials (email, password) live in the users table.
 * One-to-one with User where user.systemRole = ADMIN.
 */
@Entity
@Table(name = "admins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long adminId;

    // Link to the central auth user
    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    // Admin-specific fields can be added here in future (department, permissions level, etc.)
}
