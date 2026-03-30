package com.hyundai.dms.auth;

import lombok.Getter;
import lombok.Setter;

/**
 * Login request — role is no longer required from client.
 * Role is resolved from the users table based on email.
 */
@Getter
@Setter
public class LoginRequest {
    private String email;
    private String password;
}
