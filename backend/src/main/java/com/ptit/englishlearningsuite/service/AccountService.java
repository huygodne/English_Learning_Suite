package com.ptit.englishlearningsuite.service;

import com.ptit.englishlearningsuite.dto.AccountDTO;
import com.ptit.englishlearningsuite.entity.Account;
import com.ptit.englishlearningsuite.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
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

    // Hàm chuyển đổi từ Account Entity sang AccountDTO
    private AccountDTO convertToDto(Account account) {
        AccountDTO dto = new AccountDTO();
        dto.setId(account.getId());
        dto.setUsername(account.getUsername());
        dto.setFullName(account.getFullName());
        return dto;
    }
}