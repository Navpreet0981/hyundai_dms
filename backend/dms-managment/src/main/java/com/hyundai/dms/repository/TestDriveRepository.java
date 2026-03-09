package com.hyundai.dms.repository;

import com.hyundai.dms.entity.TestDrive;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestDriveRepository extends JpaRepository<TestDrive, Long> {

    List<TestDrive> findByDealerDealerId(Long dealerId);

    List<TestDrive> findByEmployeeEmployeeId(Long employeeId);

    List<TestDrive> findByCustomerCustomerId(Long customerId);

}