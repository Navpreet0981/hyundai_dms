package com.hyundai.dms.repository;

import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.entity.Employee;
import com.hyundai.dms.enums.EmployeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    List<Employee> findByDealerDealerIdAndActiveTrueOrderByEmployeeIdAsc(Long dealerId);
    Optional<Employee> findByEmail(String email);
    long countByDealerDealerId(Long dealerId);
    Long countByDealer(Dealer dealer);
    List<Employee> findByDealer_DealerIdAndStatus(Long dealerId, EmployeeStatus status);
}