package com.ptit.englishlearningsuite.dto;

import lombok.Data;

@Data
public class AdminAccountRequest {
    private String username;
    private String fullName;
    private String password;
    private String role;
}

