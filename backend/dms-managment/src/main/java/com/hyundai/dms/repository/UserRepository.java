package com.hyundai.dms.repository;

import com.hyundai.dms.entity.User;
import com.hyundai.dms.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndSystemRole(String email, UserRole systemRole);
    boolean existsByEmail(String email);
}
