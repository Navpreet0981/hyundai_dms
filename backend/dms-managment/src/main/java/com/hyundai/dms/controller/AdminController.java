package com.hyundai.dms.controller;

import com.hyundai.dms.dto.AdminRequest;
import com.hyundai.dms.entity.Admin;
import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.repository.AdminRepository;
import com.hyundai.dms.repository.DealerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class AdminController {

    private final AdminRepository adminRepository;
    private final DealerRepository dealerRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(AdminRepository adminRepository,
                           DealerRepository dealerRepository,
                           PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.dealerRepository = dealerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // POST /auth/register → public, creates first admin
    @PostMapping("/auth/register")
    public ResponseEntity<Admin> registerAdmin(@RequestBody AdminRequest request) {
        if (adminRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Admin with this email already exists");
        }
        Admin admin = new Admin();
        admin.setName(request.getName());
        admin.setEmail(request.getEmail());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setRole("ADMIN");
        admin.setActive(true);
        return ResponseEntity.ok(adminRepository.save(admin));
    }

    // POST /auth/reset-dealer-password → public, resets a dealer's password
    // Body: { "email": "dealer@email.com", "password": "newpassword" }
    @PostMapping("/auth/reset-dealer-password")
    public ResponseEntity<String> resetDealerPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String newPassword = body.get("password");

        if (email == null || newPassword == null) {
            return ResponseEntity.badRequest().body("email and password are required");
        }

        Dealer dealer = dealerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Dealer not found: " + email));

        dealer.setPassword(passwordEncoder.encode(newPassword));
        dealerRepository.save(dealer);

        return ResponseEntity.ok("Password reset successfully for " + email);
    }
}
