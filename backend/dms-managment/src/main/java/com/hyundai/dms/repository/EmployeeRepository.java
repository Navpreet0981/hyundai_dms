package com.hyundai.dms.repository;

import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.entity.Employee;
import com.hyundai.dms.enums.EmployeeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Auth: find employee by their linked user's email
    Optional<Employee> findByUser_Email(String email);

    // Dealer: get active employees under a dealer (active = user.active = true)
    @Query("""
        SELECT e FROM Employee e
        WHERE e.dealer.dealerId = :dealerId
          AND e.status = com.hyundai.dms.enums.EmployeeStatus.ACTIVE
          AND e.user.active = true
        ORDER BY e.employeeId ASC
    """)
    List<Employee> findByDealerDealerIdAndActiveTrueOrderByEmployeeIdAsc(@Param("dealerId") Long dealerId);

    long countByDealer_DealerId(Long dealerId);
    // Alias used by DealerDashboardServiceImpl
    default long countByDealerDealerId(Long dealerId) {
        return countByDealer_DealerId(dealerId);
    }
    Long countByDealer(Dealer dealer);

    List<Employee> findByDealer_DealerIdAndStatus(Long dealerId, EmployeeStatus status);

    // Paginated: dealer sees their active employees
    Page<Employee> findByDealer_DealerIdAndStatus(Long dealerId, EmployeeStatus status, Pageable pageable);

    // Paginated: employee self-view
    Page<Employee> findByEmployeeId(Long employeeId, Pageable pageable);

    // Admin: search all employees
    @Query("""
        SELECT e FROM Employee e
        WHERE LOWER(e.user.name) LIKE LOWER(CONCAT('%', :search, '%'))
           OR LOWER(e.user.email) LIKE LOWER(CONCAT('%', :search, '%'))
           OR LOWER(e.user.name) LIKE LOWER(CONCAT('%', :search, '%'))
    """)
    Page<Employee> searchAll(String search, Pageable pageable);

    // Dealer: search only their active employees
    @Query("""
        SELECT e FROM Employee e
        WHERE e.dealer.dealerId = :dealerId
          AND e.status = :status
          AND (
               LOWER(e.user.name) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(e.user.email) LIKE LOWER(CONCAT('%', :search, '%'))
          )
    """)
    Page<Employee> searchByDealer(
            @Param("dealerId") Long dealerId,
            @Param("status") EmployeeStatus status,
            @Param("search") String search,
            Pageable pageable
    );

    @Modifying
    @Query("UPDATE Employee e SET e.dealer.dealerId = :newDealerId WHERE e.dealer.dealerId = :oldDealerId")
    void reassignDealer(@Param("oldDealerId") Long oldDealerId, @Param("newDealerId") Long newDealerId);
}
