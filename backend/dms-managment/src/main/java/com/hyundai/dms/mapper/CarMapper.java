package com.hyundai.dms.mapper;

import com.hyundai.dms.dto.CarDTO;
import com.hyundai.dms.entity.Car;

public class CarMapper {

    public static CarDTO toDTO(Car car) {
        return CarDTO.builder()
                .carId(car.getCarId())
                .modelName(car.getModelName())
                .fuelType(car.getFuelType())
                .transmission(car.getTransmission())
                .basePrice(car.getBasePrice())
                .active(car.getActive() != null && car.getActive())
                .build();
    }

    public static Car toEntity(CarDTO dto) {
        return Car.builder()
                .carId(dto.getCarId())
                .modelName(dto.getModelName())
                .fuelType(dto.getFuelType())
                .transmission(dto.getTransmission())
                .basePrice(dto.getBasePrice())
                .active(dto.isActive())
                .build();
    }
}