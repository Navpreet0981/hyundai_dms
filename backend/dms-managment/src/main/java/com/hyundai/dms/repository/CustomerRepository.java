package com.hyundai.dms.repository;

import com.hyundai.dms.entity.Customer;
import com.hyundai.dms.entity.Dealer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    long countByDealerDealerId(Long dealerId);
    @Query("SELECT c.leadSource, COUNT(c) FROM Customer c GROUP BY c.leadSource")
    List<Object[]> countLeadsBySource();
    Long countByDealer(Dealer dealer);

    List<Customer> findByEmployee_EmployeeId(Long employeeId);

    List<Customer> findByEmployee_Dealer_DealerId(Long dealerId);

    long countByEmployee_EmployeeId(Long employeeId);

    long countByEmployee_Dealer_DealerId(Long dealerId);
}