package com.ptit.englishlearningsuite.controller;

import com.ptit.englishlearningsuite.dto.AccountDTO;
import com.ptit.englishlearningsuite.dto.LoginRequest;
import com.ptit.englishlearningsuite.dto.LoginResponse;
import com.ptit.englishlearningsuite.entity.Account;
import com.ptit.englishlearningsuite.service.AccountService;
import com.ptit.englishlearningsuite.service.CustomUserDetailsService;
import com.ptit.englishlearningsuite.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Account account) {
        try {
            AccountDTO accountDto = accountService.registerAccount(account);
            return ResponseEntity.ok(accountDto);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            // Xác thực thông tin đăng nhập
            accountService.login(loginRequest.getUsername(), loginRequest.getPassword());

            // Lấy thông tin UserDetails để tạo token
            final UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());

            // Tạo token
            final String jwt = jwtUtil.generateToken(userDetails);

            // Trả về token cho client
            return ResponseEntity.ok(new LoginResponse(jwt));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}