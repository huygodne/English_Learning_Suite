package com.ptit.englishlearningsuite.service;

import com.ptit.englishlearningsuite.dto.AccountDTO;
import com.ptit.englishlearningsuite.dto.AdminAccountRequest;
import com.ptit.englishlearningsuite.entity.Account;
import com.ptit.englishlearningsuite.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AccountDTO registerAccount(Account account) {
        if (accountRepository.findByUsername(account.getUsername()).isPresent()) {
            throw new IllegalStateException("Username '" + account.getUsername() + "' already exists.");
        }
        String encodedPassword = passwordEncoder.encode(account.getPassword());
        account.setPassword(encodedPassword);
        account.setRole("USER");

        Account savedAccount = accountRepository.save(account);
        return convertToDto(savedAccount);
    }

    public AccountDTO login(String username, String rawPassword) {
        Account account = accountRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found or password incorrect."));

        if (passwordEncoder.matches(rawPassword, account.getPassword())) {
            return convertToDto(account);
        } else {
            throw new RuntimeException("User not found or password incorrect.");
        }
    }

    public List<AccountDTO> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public AccountDTO createAccountByAdmin(AdminAccountRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        Optional<Account> existing = accountRepository.findByUsername(request.getUsername());
        if (existing.isPresent()) {
            throw new IllegalStateException("Username '" + request.getUsername() + "' already exists.");
        }

        Account account = new Account();
        account.setUsername(request.getUsername().trim());
        account.setFullName(request.getFullName());
        account.setPassword(passwordEncoder.encode(request.getPassword()));
        account.setRole(normalizeRole(request.getRole()));

        return convertToDto(accountRepository.save(account));
    }

    public AccountDTO updateAccountByAdmin(Long id, AdminAccountRequest request) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Account not found with id " + id));

        if (request.getFullName() != null) {
            account.setFullName(request.getFullName());
        }
        if (request.getRole() != null) {
            account.setRole(normalizeRole(request.getRole()));
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            account.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return convertToDto(accountRepository.save(account));
    }

    public void deleteAccountByAdmin(Long id) {
        if (!accountRepository.existsById(id)) {
            throw new IllegalArgumentException("Account not found with id " + id);
        }
        accountRepository.deleteById(id);
    }

    public Account findByUsername(String username) {
        return accountRepository.findByUsername(username)
                .orElse(null);
    }

    private AccountDTO convertToDto(Account account) {
        AccountDTO dto = new AccountDTO();
        dto.setId(account.getId());
        dto.setUsername(account.getUsername());
        dto.setFullName(account.getFullName());
        dto.setRole(account.getRole());
        return dto;
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) {
            return "USER";
        }
        return role.trim().toUpperCase();
    }
}