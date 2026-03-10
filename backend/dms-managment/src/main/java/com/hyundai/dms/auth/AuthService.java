package com.hyundai.dms.auth;

import com.hyundai.dms.security.JwtService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final JwtService jwtService;

    public AuthService(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {

        // TEMPORARY LOGIN (for testing)
        // Later we will connect to database

        if ("admin@hyundai.com".equals(request.getEmail())
                && "admin123".equals(request.getPassword())) {

            String token = jwtService.generateToken(request.getEmail());

            return new LoginResponse(token);
        }

        throw new RuntimeException("Invalid credentials");
    }
}