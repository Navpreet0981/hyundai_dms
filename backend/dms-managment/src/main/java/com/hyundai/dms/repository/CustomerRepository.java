package com.hyundai.dms.repository;

import com.hyundai.dms.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    long countByDealerDealerId(Long dealerId);
}