package com.hyundai.dms.controller;

import com.hyundai.dms.dto.CarVariantDTO;
import com.hyundai.dms.service.CarVariantService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/variants")
public class CarVariantController {

    private final CarVariantService variantService;

    public CarVariantController(CarVariantService variantService) {
        this.variantService = variantService;
    }

    // Create Variant
    @PostMapping
    public CarVariantDTO createVariant(@RequestBody CarVariantDTO dto) {
        return variantService.createVariant(dto);
    }

    // Get Variants by Car
    @GetMapping("/car/{carId}")
    public List<CarVariantDTO> getVariantsByCar(@PathVariable("carId") Long carId) {
        return variantService.getVariantsByCar(carId);
    }
    // Get Variant by ID
    @GetMapping("/{id}")
    public CarVariantDTO getVariant(@PathVariable("id") Long id) {
        return variantService.getVariantById(id);
    }

    // Delete Variant
    @DeleteMapping("/{id}")
    public void deleteVariant(@PathVariable("id") Long id) {
        variantService.deleteVariant(id);
    }
}