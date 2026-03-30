package com.hyundai.dms.controller;

import com.hyundai.dms.dto.AdminRequest;
import com.hyundai.dms.entity.Admin;
import com.hyundai.dms.entity.User;
import com.hyundai.dms.enums.UserRole;
import com.hyundai.dms.repository.AdminRepository;
import com.hyundai.dms.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class AdminController {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(AdminRepository adminRepository,
                           UserRepository userRepository,
                           PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // POST /auth/register — bootstrap endpoint to create the first admin (public, one-time use)
    @PostMapping("/auth/register")
    public ResponseEntity<User> registerAdmin(@RequestBody AdminRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with this email already exists");
        }

        // Create the auth user
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .systemRole(UserRole.ADMIN)
                .active(true)
                .build();
        User savedUser = userRepository.save(user);

        // Create the admin profile
        Admin admin = Admin.builder()
                .user(savedUser)
                .build();
        adminRepository.save(admin);

        return ResponseEntity.ok(savedUser);
    }

    // PUT /admin/change-password — admin changes their own password
    @PutMapping("/admin/change-password")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, String> body) {
        String currentPassword = body.get("currentPassword");
        String newPassword     = body.get("newPassword");

        if (currentPassword == null || newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body("currentPassword and newPassword are required");
        }

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok("Password updated successfully");
    }
}
