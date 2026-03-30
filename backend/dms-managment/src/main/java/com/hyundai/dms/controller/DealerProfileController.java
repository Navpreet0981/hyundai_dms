package com.hyundai.dms.controller;

import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.entity.User;
import com.hyundai.dms.repository.DealerRepository;
import com.hyundai.dms.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/dealer")
public class DealerProfileController {

    private final DealerRepository dealerRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DealerProfileController(DealerRepository dealerRepository,
                                   UserRepository userRepository,
                                   PasswordEncoder passwordEncoder) {
        this.dealerRepository = dealerRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // GET /dealer/profile — returns the logged-in dealer's own profile
    @GetMapping("/profile")
    public Dealer getDealerProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return dealerRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));
    }

    // PUT /dealer/change-password — dealer changes their own password
    @PutMapping("/change-password")
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
