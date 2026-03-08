package com.hyundai.dms.entity;

import jakarta.persistence.*;
import lombok.*;

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

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String role;

    private boolean active;
}