package com.ptit.englishlearningsuite.controller;

import com.ptit.englishlearningsuite.dto.AccountDTO;
import com.ptit.englishlearningsuite.dto.AdminAccountRequest;
import com.ptit.englishlearningsuite.dto.AdminDashboardDTO;
import com.ptit.englishlearningsuite.service.AccountService;
import com.ptit.englishlearningsuite.service.AdminDashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AccountService accountService;

    @Autowired
    private AdminDashboardService adminDashboardService;

    @GetMapping("/users")
    public List<AccountDTO> getAllUsers() {
        return accountService.getAllAccounts();
    }

    @GetMapping("/dashboard")
    public AdminDashboardDTO getDashboard() {
        return adminDashboardService.getDashboard();
    }

    @PostMapping("/users")
    public AccountDTO createUser(@RequestBody AdminAccountRequest request) {
        return accountService.createAccountByAdmin(request);
    }

    @PutMapping("/users/{id}")
    public AccountDTO updateUser(@PathVariable Long id, @RequestBody AdminAccountRequest request) {
        return accountService.updateAccountByAdmin(id, request);
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        accountService.deleteAccountByAdmin(id);
    }
}