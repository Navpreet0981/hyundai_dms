package com.hyundai.dms.entity;

import jakarta.persistence.*;
import lombok.*;
import com.hyundai.dms.enums.LeadStatus;
import java.time.LocalDate;

@Entity
@Table(name = "customers")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long customerId;

    private String name;

    private String phone;

    private String email;

    private String city;

    // Lead information
    private String leadSource;      // WEBS// ITE / WALKIN / REFERRAL
    private String interestedModel; // Creta / i20 / Verna
    @Enumerated(EnumType.STRING)
    private LeadStatus leadStatus;
    private LocalDate createdDate;

    // dealer receiving the lead
    @ManyToOne
    @JoinColumn(name = "dealer_id")
    private Dealer dealer;

    // employee handling the lead
    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
}