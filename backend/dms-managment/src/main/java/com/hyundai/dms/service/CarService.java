package com.hyundai.dms.service;

import com.hyundai.dms.dto.CarDTO;
import com.hyundai.dms.entity.Car;
import com.hyundai.dms.mapper.CarMapper;
import com.hyundai.dms.repository.CarRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CarService {

    private final CarRepository carRepository;

    public CarService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    public CarDTO createCar(CarDTO dto) {

        Car car = CarMapper.toEntity(dto);

        Car saved = carRepository.save(car);

        return CarMapper.toDTO(saved);
    }

    public List<CarDTO> getAllCars() {

        return carRepository.findAll()
                .stream()
                .map(CarMapper::toDTO)
                .collect(Collectors.toList());
    }

    public CarDTO getCarById(Long id) {

        Car car = carRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Car not found"));

        return CarMapper.toDTO(car);
    }

    public void deleteCar(Long id) {
        carRepository.deleteById(id);
    }
}