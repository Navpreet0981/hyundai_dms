package com.hyundai.dms.repository;

import com.hyundai.dms.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    List<ServiceRequest> findByDealerDealerId(Long dealerId);

    List<ServiceRequest> findByCustomerCustomerId(Long customerId);


    List<ServiceRequest> findByEmployeeEmployeeId(Long employeeId);


    long countByEmployeeEmployeeId(Long employeeId);

    long countByEmployeeDealerDealerId(Long dealerId);

    long countByDealerDealerId(Long dealerId);

    @Modifying
    @Query("UPDATE ServiceRequest s SET s.dealer.dealerId = :newDealerId WHERE s.dealer.dealerId = :oldDealerId")
    void reassignDealer(@Param("oldDealerId") Long oldDealerId, @Param("newDealerId") Long newDealerId);

    @Modifying
    @Query("UPDATE ServiceRequest s SET s.employee.employeeId = :newEmployeeId WHERE s.employee.employeeId = :oldEmployeeId")
    void reassignEmployee(@Param("oldEmployeeId") Long oldEmployeeId, @Param("newEmployeeId") Long newEmployeeId);
}