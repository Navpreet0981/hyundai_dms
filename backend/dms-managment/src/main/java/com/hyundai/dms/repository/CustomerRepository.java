package com.hyundai.dms.repository;

import com.hyundai.dms.entity.Customer;
import com.hyundai.dms.entity.Dealer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    long countByDealerDealerId(Long dealerId);
    @Query("SELECT c.leadSource, COUNT(c) FROM Customer c GROUP BY c.leadSource")
    List<Object[]> countLeadsBySource();
    Long countByDealer(Dealer dealer);

    List<Customer> findByEmployee_EmployeeId(Long employeeId);

    List<Customer> findByEmployee_Dealer_DealerId(Long dealerId);

    Page<Customer> findByEmployee_EmployeeId(Long employeeId, Pageable pageable);

    Page<Customer> findByEmployee_Dealer_DealerId(Long dealerId, Pageable pageable);

    long countByEmployee_EmployeeId(Long employeeId);

    long countByEmployee_Dealer_DealerId(Long dealerId);

    // ✅ ADMIN → search all customers
    @Query("""
    SELECT c FROM Customer c
    WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%'))
       OR LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%'))
       OR LOWER(c.phone) LIKE LOWER(CONCAT('%', :search, '%'))
""")
    Page<Customer> searchAll(String search, Pageable pageable);


    // ✅ EMPLOYEE → search own customers
    @Query("""
    SELECT c FROM Customer c
    WHERE c.employee.employeeId = :employeeId
      AND (
           LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%'))
        OR LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%'))
        OR LOWER(c.phone) LIKE LOWER(CONCAT('%', :search, '%'))
      )
""")
    Page<Customer> searchByEmployee(Long employeeId, String search, Pageable pageable);


    // ✅ DEALER → search dealer customers
    @Query("""
    SELECT c FROM Customer c
    WHERE c.employee.dealer.dealerId = :dealerId
      AND (
           LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%'))
        OR LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%'))
        OR LOWER(c.phone) LIKE LOWER(CONCAT('%', :search, '%'))
      )
""")
    Page<Customer> searchByDealer(Long dealerId, String search, Pageable pageable);
}