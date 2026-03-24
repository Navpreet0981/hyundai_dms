package com.hyundai.dms.repository;

import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.entity.Employee;
import com.hyundai.dms.enums.EmployeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    List<Employee> findByDealerDealerIdAndActiveTrueOrderByEmployeeIdAsc(Long dealerId);
    Optional<Employee> findByEmail(String email);
    long countByDealerDealerId(Long dealerId);
    Long countByDealer(Dealer dealer);
    List<Employee> findByDealer_DealerIdAndStatus(Long dealerId, EmployeeStatus status);
    // For DEALER (ACTIVE employees)
    Page<Employee> findByDealer_DealerIdAndStatus(
            Long dealerId,
            EmployeeStatus status,
            Pageable pageable
    );

    //For EMPLOYEE (self view - optional but used in service)
    Page<Employee> findByEmployeeId(Long employeeId, Pageable pageable);

    // ✅ ADMIN → search all employees
    @Query("""
    SELECT e FROM Employee e
    WHERE LOWER(e.name) LIKE LOWER(CONCAT('%', :search, '%'))
       OR LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%'))
       OR LOWER(e.phone) LIKE LOWER(CONCAT('%', :search, '%'))
""")
    Page<Employee> searchAll(String search, Pageable pageable);

    // ✅ DEALER → search only their ACTIVE employees
    @Query("""
    SELECT e FROM Employee e
    WHERE e.dealer.dealerId = :dealerId
      AND e.status = :status
      AND (
           LOWER(e.name) LIKE LOWER(CONCAT('%', :search, '%'))
        OR LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%'))
        OR LOWER(e.phone) LIKE LOWER(CONCAT('%', :search, '%'))
      )
""")
    Page<Employee> searchByDealer(
            Long dealerId,
            EmployeeStatus status,
            String search,
            Pageable pageable
    );

}