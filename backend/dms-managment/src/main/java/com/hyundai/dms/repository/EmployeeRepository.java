package com.hyundai.dms.repository;

import com.hyundai.dms.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

//    List<Employee> findByDealerIdAndActiveTrueOrderByEmployeeIdAsc(Long dealerId);

}