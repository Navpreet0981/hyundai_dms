package com.hyundai.dms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarVariantDTO {

    private Long variantId;
    private String variantName;
    private String engineType;
    private double price;
    private boolean active;

    private Long carId;
}