package com.hyundai.dms.service;

import com.hyundai.dms.dto.CarVariantDTO;
import com.hyundai.dms.entity.Car;
import com.hyundai.dms.entity.CarVariant;
import com.hyundai.dms.mapper.CarVariantMapper;
import com.hyundai.dms.repository.CarRepository;
import com.hyundai.dms.repository.CarVariantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarVariantService {

    private final CarVariantRepository variantRepository;
    private final CarRepository carRepository;

    public CarVariantService(CarVariantRepository variantRepository,
                             CarRepository carRepository) {
        this.variantRepository = variantRepository;
        this.carRepository = carRepository;
    }

    public CarVariantDTO createVariant(CarVariantDTO dto) {

        Car car = carRepository.findById(dto.getCarId())
                .orElseThrow(() -> new RuntimeException("Car not found"));

        CarVariant variant = CarVariant.builder()
                .variantName(dto.getVariantName())
                .engineType(dto.getEngineType())
                .price(dto.getPrice())
                .active(dto.isActive())
                .car(car)
                .build();

        CarVariant saved = variantRepository.save(variant);

        return CarVariantMapper.toDTO(saved);
    }

    public List<CarVariantDTO> getVariantsByCar(Long carId) {

        return variantRepository.findByCarCarId(carId)
                .stream()
                .map(CarVariantMapper::toDTO)
                .collect(Collectors.toList());
    }

    public CarVariantDTO getVariantById(Long id) {

        CarVariant variant = variantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Variant not found"));

        return CarVariantMapper.toDTO(variant);
    }

    public void deleteVariant(Long id) {
        variantRepository.deleteById(id);
    }
}