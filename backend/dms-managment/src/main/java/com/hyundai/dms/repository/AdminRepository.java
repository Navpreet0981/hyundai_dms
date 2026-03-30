package com.hyundai.dms.repository;

import com.hyundai.dms.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByUser_Email(String email);
    Optional<Admin> findByUser_UserId(Long userId);
}
