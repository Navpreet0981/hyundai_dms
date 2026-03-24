package com.hyundai.dms.repository;

import com.hyundai.dms.entity.Dealer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface DealerRepository extends JpaRepository<Dealer, Long> {
    Optional<Dealer> findByEmail(String email);
    // ✅ ADMIN → search dealers
    @Query("""
    SELECT d FROM Dealer d
    WHERE LOWER(d.dealerName) LIKE LOWER(CONCAT('%', :search, '%'))
       OR LOWER(d.city) LIKE LOWER(CONCAT('%', :search, '%'))
       OR LOWER(d.email) LIKE LOWER(CONCAT('%', :search, '%'))
""")
    Page<Dealer> searchDealers(String search, Pageable pageable);
}