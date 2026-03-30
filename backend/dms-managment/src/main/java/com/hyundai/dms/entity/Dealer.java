package com.hyundai.dms.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

/**
 * Dealer profile table — stores dealership business data.
 * Auth credentials (email, password) live in the users table.
 * One-to-one with User where user.systemRole = DEALER.
 * Hierarchy: managed_by → User (admin) who created/manages this dealer.
 */
@Entity
@Table(name = "dealers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dealer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dealerId;

    // Link to the central auth user (this dealer's login account)
    @OneToOne
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    @JsonIgnoreProperties({"password", "createdAt", "updatedAt"})
    private User user;

    // Which admin user created/manages this dealer (replaces old admin_id FK)
    @ManyToOne
    @JoinColumn(name = "managed_by", nullable = false)
    @JsonIgnoreProperties({"password", "createdAt", "updatedAt"})
    private User managedBy;

    @Column(nullable = false)
    private String dealerName;

    @Column(nullable = false)
    private String phone;

    private String city;
    private String state;
    private String address;

    @Column(nullable = false)
    private Boolean active;

    // Convenience: get email from linked user (no duplication)
    @Transient
    public String getEmail() {
        return user != null ? user.getEmail() : null;
    }
}
