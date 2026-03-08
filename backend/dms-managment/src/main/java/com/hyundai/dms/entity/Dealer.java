package com.hyundai.dms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "dealers")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Dealer {

    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Admin admin;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dealerId;

    @Column(nullable = false)
    private String dealerName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    private String city;

    private String state;

    private String address;

    private boolean active;
}