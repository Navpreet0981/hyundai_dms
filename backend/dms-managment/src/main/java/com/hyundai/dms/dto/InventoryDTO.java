package com.hyundai.dms.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryDTO {

    private Long inventoryId;
    private Long dealerId;
    private Long variantId;
    private String variantName;
    private String engineType;
    private double price;
    private String modelName;
    private String fuelType;
    private String transmission;
    private int quantity;
}
