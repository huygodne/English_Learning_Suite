package com.ptit.englishlearningsuite.controller;

import com.ptit.englishlearningsuite.dto.AccountDTO;
import com.ptit.englishlearningsuite.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AccountService accountService;

    @GetMapping("/users")
    public List<AccountDTO> getAllUsers() {
        return accountService.getAllAccounts();
    }
}