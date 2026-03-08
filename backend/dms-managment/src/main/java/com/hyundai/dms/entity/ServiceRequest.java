package com.hyundai.dms.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "service_requests")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ServiceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long serviceRequestId;

    private LocalDate serviceDate;

    private String issueDescription;

    private String status;

    // Customer requesting service
    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    // Dealer handling service
    @ManyToOne
    @JoinColumn(name = "dealer_id")
    private Dealer dealer;

    // Variant of the vehicle
    @ManyToOne
    @JoinColumn(name = "variant_id")
    private CarVariant carVariant;
}