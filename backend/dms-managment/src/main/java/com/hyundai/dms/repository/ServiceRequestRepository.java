package com.hyundai.dms.repository;

import com.hyundai.dms.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    List<ServiceRequest> findByDealerDealerId(Long dealerId);

    List<ServiceRequest> findByCustomerCustomerId(Long customerId);


    List<ServiceRequest> findByEmployeeEmployeeId(Long employeeId);


    long countByEmployeeEmployeeId(Long employeeId);

    long countByEmployeeDealerDealerId(Long dealerId);

    long countByDealerDealerId(Long dealerId);
}