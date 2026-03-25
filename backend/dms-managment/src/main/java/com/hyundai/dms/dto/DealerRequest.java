package com.hyundai.dms.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DealerRequest {
    private String dealerName;
    private String email;
    private String phone;
    private String city;
    private String state;
    private String address;
    private String password;
    private Boolean active;
}
