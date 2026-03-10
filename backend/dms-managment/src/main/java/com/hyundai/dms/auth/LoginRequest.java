package com.hyundai.dms.auth;

import lombok.*;

@Getter
@Setter
public class LoginRequest {

    private String email;
    private String password;
    private String role;
}