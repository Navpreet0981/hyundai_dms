package com.hyundai.dms.auth;

import com.hyundai.dms.service.AuditService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final AuditService auditService;

    public AuthController(AuthService authService, AuditService auditService) {
        this.authService = authService;
        this.auditService = auditService;
    }

    // POST /auth/login — validates credentials and returns JWT
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    // POST /auth/logout — writes LOGOUT audit log entry (JWT is stateless, client clears token)
    @PostMapping("/logout")
    public void logout() {
        // SecurityContext is populated by JwtFilter — resolves actor automatically
        auditService.logFromContext("LOGOUT", "Auth", null, "User logged out");
    }
}