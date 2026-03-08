package com.hyundai.dms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cars")

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long carId;

    @Column(nullable = false)
    private String modelName;

    private String fuelType;

    private String transmission;

    private double basePrice;

    private boolean active;
}