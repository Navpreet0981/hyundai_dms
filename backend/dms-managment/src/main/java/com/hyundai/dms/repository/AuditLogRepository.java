package com.hyundai.dms.repository;

import com.hyundai.dms.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    // Admin: all logs, optionally filtered by search
    @Query("""
        SELECT a FROM AuditLog a
        WHERE (:search IS NULL OR :search = ''
            OR LOWER(a.actorEmail) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(a.action)     LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(a.entity)     LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(a.description)LIKE LOWER(CONCAT('%', :search, '%')))
        ORDER BY a.timestamp DESC
    """)
    Page<AuditLog> searchAll(@Param("search") String search, Pageable pageable);

    // Dealer: only logs where dealerId matches
    @Query("""
        SELECT a FROM AuditLog a
        WHERE a.dealerId = :dealerId
          AND (:search IS NULL OR :search = ''
            OR LOWER(a.actorEmail) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(a.action)     LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(a.entity)     LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(a.description)LIKE LOWER(CONCAT('%', :search, '%')))
        ORDER BY a.timestamp DESC
    """)
    Page<AuditLog> searchByDealer(@Param("dealerId") Long dealerId,
                                   @Param("search") String search,
                                   Pageable pageable);
}
