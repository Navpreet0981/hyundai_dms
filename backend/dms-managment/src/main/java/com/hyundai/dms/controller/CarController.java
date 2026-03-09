package com.hyundai.dms.controller;

import com.hyundai.dms.dto.CarDTO;
import com.hyundai.dms.service.CarService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cars")
public class CarController {

    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    // Create Car
    @PostMapping
    public CarDTO createCar(@RequestBody CarDTO dto) {
        return carService.createCar(dto);
    }

    // Get All Cars
    @GetMapping
    public List<CarDTO> getAllCars() {
        return carService.getAllCars();
    }

    // Get Car by ID
    @GetMapping("/{id}")
    public CarDTO getCarById(@PathVariable Long id) {
        return carService.getCarById(id);
    }

    // Delete Car
    @DeleteMapping("/{id}")
    public void deleteCar(@PathVariable Long id) {
        carService.deleteCar(id);
    }
}