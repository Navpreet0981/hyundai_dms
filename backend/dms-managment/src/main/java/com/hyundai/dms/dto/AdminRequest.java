package com.hyundai.dms.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminRequest {
    private String name;
    private String email;
    private String password;
}
