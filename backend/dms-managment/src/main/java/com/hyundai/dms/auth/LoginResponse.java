package com.hyundai.dms.auth;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
public class LoginResponse {

    private String token;

    public LoginResponse(String token) {
        this.token = token;
    }
}