package com.hyundai.dms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarDTO {

    private Long carId;
    private String modelName;
    private String fuelType;
    private String transmission;
    private double basePrice;
    private boolean active;
}