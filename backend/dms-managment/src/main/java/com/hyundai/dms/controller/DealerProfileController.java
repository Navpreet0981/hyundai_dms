package com.hyundai.dms.controller;

import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.repository.DealerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/dealer")
public class DealerProfileController {

    private final DealerRepository dealerRepository;
    private final PasswordEncoder passwordEncoder;

    public DealerProfileController(DealerRepository dealerRepository,
                                   PasswordEncoder passwordEncoder) {
        this.dealerRepository = dealerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // GET /dealer/profile — returns the logged-in dealer's own profile
    @GetMapping("/profile")
    public Dealer getDealerProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return dealerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));
    }

    // PUT /dealer/change-password — dealer changes their own password (must provide current password)
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody Map<String, String> body) {
        String currentPassword = body.get("currentPassword");
        String newPassword     = body.get("newPassword");

        if (currentPassword == null || newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body("currentPassword and newPassword are required");
        }

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Dealer dealer = dealerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));

        // Verify current password before allowing change
        if (!passwordEncoder.matches(currentPassword, dealer.getPassword())) {
            return ResponseEntity.badRequest().body("Current password is incorrect");
        }

        dealer.setPassword(passwordEncoder.encode(newPassword));
        dealerRepository.save(dealer);

        return ResponseEntity.ok("Password updated successfully");
    }
}