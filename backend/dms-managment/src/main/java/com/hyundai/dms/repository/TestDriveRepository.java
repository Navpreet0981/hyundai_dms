package com.hyundai.dms.repository;

import com.hyundai.dms.entity.TestDrive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TestDriveRepository extends JpaRepository<TestDrive, Long> {

    List<TestDrive> findByEmployeeDealerDealerId(Long dealerId);


    List<TestDrive> findByEmployeeEmployeeId(Long employeeId);

    List<TestDrive> findByCustomerCustomerId(Long customerId);

    long countByDealerDealerId(Long dealerId);
    @Query("SELECT COUNT(t) FROM TestDrive t")
    Long getTotalTestDrives();

    long countByEmployeeEmployeeId(Long employeeId);

    long countByEmployeeDealerDealerId(Long dealerId);

    //  EMPLOYEE → own test drives
    Page<TestDrive> findByEmployeeEmployeeId(Long employeeId, Pageable pageable);

    // DEALER → dealer test drives
    Page<TestDrive> findByEmployeeDealerDealerId(Long dealerId, Pageable pageable);

    @Modifying
    @Query("UPDATE TestDrive t SET t.dealer.dealerId = :newDealerId WHERE t.dealer.dealerId = :oldDealerId")
    void reassignDealer(@Param("oldDealerId") Long oldDealerId, @Param("newDealerId") Long newDealerId);

    @Modifying
    @Query("UPDATE TestDrive t SET t.employee.employeeId = :newEmployeeId WHERE t.employee.employeeId = :oldEmployeeId")
    void reassignEmployee(@Param("oldEmployeeId") Long oldEmployeeId, @Param("newEmployeeId") Long newEmployeeId);
}