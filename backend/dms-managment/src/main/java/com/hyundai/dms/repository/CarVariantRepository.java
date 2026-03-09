package com.hyundai.dms.repository;

import com.hyundai.dms.entity.CarVariant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CarVariantRepository extends JpaRepository<CarVariant, Long> {

    List<CarVariant> findByCarCarId(Long carId);

}