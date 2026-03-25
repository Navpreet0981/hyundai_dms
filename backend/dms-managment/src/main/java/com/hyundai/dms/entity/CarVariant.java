package com.hyundai.dms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "car_variants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long variantId;

    @Column(nullable = false)
    private String variantName;

    private String engineType;
    private double price;

    // Fix #5: Boolean wrapper — handles null from JSON without throwing
    private Boolean active;

    @ManyToOne
    @JoinColumn(name = "car_id")
    private Car car;
}
