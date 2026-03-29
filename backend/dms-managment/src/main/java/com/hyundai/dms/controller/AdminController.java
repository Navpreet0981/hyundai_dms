package com.hyundai.dms.controller;

import com.hyundai.dms.dto.AdminRequest;
import com.hyundai.dms.entity.Admin;
import com.hyundai.dms.repository.AdminRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class AdminController {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(AdminRepository adminRepository,
                           PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // POST /auth/register — bootstrap endpoint to create the first admin (public, one-time use)
    @PostMapping("/auth/register")
    public ResponseEntity<Admin> registerAdmin(@RequestBody AdminRequest request) {
        // Prevent duplicate admin registration with same email
        if (adminRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Admin with this email already exists");
        }
        Admin admin = new Admin();
        admin.setName(request.getName());
        admin.setEmail(request.getEmail());
        admin.setPassword(passwordEncoder.encode(request.getPassword())); // BCrypt encode before save
        admin.setRole("ADMIN");
        admin.setActive(true);
        return ResponseEntity.ok(adminRepository.save(admin));
    }

    // PUT /admin/change-password — admin changes their own password (must provide current password)
    @PutMapping("/admin/change-password")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, String> body) {
        String currentPassword = body.get("currentPassword");
        String newPassword     = body.get("newPassword");

        if (currentPassword == null || newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body("currentPassword and newPassword are required");
        }

        // Resolve logged-in admin from JWT
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        // Verify current password before allowing change
        if (!passwordEncoder.matches(currentPassword, admin.getPassword())) {
            return ResponseEntity.badRequest().body("Current password is incorrect");
        }

        admin.setPassword(passwordEncoder.encode(newPassword));
        adminRepository.save(admin);

        return ResponseEntity.ok("Password updated successfully");
    }
}
