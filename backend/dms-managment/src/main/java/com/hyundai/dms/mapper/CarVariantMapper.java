package com.hyundai.dms.mapper;

import com.hyundai.dms.dto.CarVariantDTO;
import com.hyundai.dms.entity.CarVariant;

public class CarVariantMapper {

    public static CarVariantDTO toDTO(CarVariant variant) {
        return CarVariantDTO.builder()
                .variantId(variant.getVariantId())
                .variantName(variant.getVariantName())
                .engineType(variant.getEngineType())
                .price(variant.getPrice())
                .active(variant.getActive() != null && variant.getActive())
                .carId(variant.getCar().getCarId())
                .build();
    }
}
