package com.hyundai.dms.repository;

import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DealerRepository extends JpaRepository<Dealer, Long> {

    // Auth: find dealer by their linked user's email
    Optional<Dealer> findByUser_Email(String email);

    // Find dealer by their linked user
    Optional<Dealer> findByUser(User user);

    // Admin: find all dealers managed by a specific admin user
    List<Dealer> findByManagedBy(User managedBy);

    // Admin: paginated + searchable dealer list
    @Query("""
        SELECT d FROM Dealer d
        WHERE LOWER(d.dealerName) LIKE LOWER(CONCAT('%', :search, '%'))
           OR LOWER(d.city) LIKE LOWER(CONCAT('%', :search, '%'))
           OR LOWER(d.user.email) LIKE LOWER(CONCAT('%', :search, '%'))
    """)
    Page<Dealer> searchDealers(String search, Pageable pageable);
}
