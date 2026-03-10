package com.hyundai.dms.auth;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
public class LoginRequest {

    private String email;
    private String password;
}