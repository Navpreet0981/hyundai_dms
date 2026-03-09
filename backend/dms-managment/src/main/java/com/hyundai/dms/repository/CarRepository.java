package com.hyundai.dms.repository;

import com.hyundai.dms.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarRepository extends JpaRepository<Car, Long> {
}