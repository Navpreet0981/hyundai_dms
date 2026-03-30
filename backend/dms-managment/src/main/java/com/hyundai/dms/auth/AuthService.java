package com.hyundai.dms.auth;

import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.entity.User;
import com.hyundai.dms.repository.DealerRepository;
import com.hyundai.dms.repository.UserRepository;
import com.hyundai.dms.security.JwtService;
import com.hyundai.dms.service.AuditService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final DealerRepository dealerRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;

    public AuthService(JwtService jwtService,
                       UserRepository userRepository,
                       DealerRepository dealerRepository,
                       PasswordEncoder passwordEncoder,
                       AuditService auditService) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.dealerRepository = dealerRepository;
        this.passwordEncoder = passwordEncoder;
        this.auditService = auditService;
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        if (request.getEmail() == null || request.getPassword() == null) {
            throw new RuntimeException("Email and password are required");
        }

        // Single lookup — no more switch(role)
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.getActive()) {
            throw new RuntimeException("Account is inactive. Please contact your administrator.");
        }

        String role = user.getSystemRole().name();

        // Audit log with dealer context if applicable
        Long dealerId = null;
        String dealerName = null;

        if (role.equals("DEALER")) {
            Dealer dealer = dealerRepository.findByUser(user).orElse(null);
            if (dealer != null) {
                dealerId = dealer.getDealerId();
                dealerName = dealer.getDealerName();
            }
        } else if (role.equals("EMPLOYEE")) {
            // Employee dealer context resolved in AuditService via SecurityContext after token is set
        }

        auditService.log(user.getEmail(), role, dealerId, dealerName,
                "LOGIN", "Auth", null, user.getSystemRole().name() + " logged in");

        String token = jwtService.generateToken(user.getEmail(), role);

        return new LoginResponse(token, role, user.getUserId(), user.getName(), user.getEmail());
    }
}
