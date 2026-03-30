package com.hyundai.dms.auth;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

/**
 * Login response — returns token + role so frontend knows which dashboard to load.
 * userId included for frontend state management.
 */
@Getter
@Setter
@NoArgsConstructor
public class LoginResponse {

    private String token;
    private String role;       // ADMIN | DEALER | EMPLOYEE
    private Long userId;
    private String name;
    private String email;

    public LoginResponse(String token, String role, Long userId, String name, String email) {
        this.token = token;
        this.role = role;
        this.userId = userId;
        this.name = name;
        this.email = email;
    }
}
