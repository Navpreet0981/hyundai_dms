package com.hyundai.dms.repository;

import com.hyundai.dms.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    List<Employee> findByDealerDealerIdAndActiveTrueOrderByEmployeeIdAsc(Long dealerId);
    Optional<Employee> findByEmail(String email);
}