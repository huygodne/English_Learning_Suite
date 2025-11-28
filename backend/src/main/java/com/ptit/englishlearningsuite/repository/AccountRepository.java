package com.ptit.englishlearningsuite.repository;

import com.ptit.englishlearningsuite.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByUsername(String username);
    long countByRoleIgnoreCase(String role);
    
    @Query("SELECT COUNT(a) FROM Account a WHERE a.createdAt >= :startDate AND a.createdAt < :endDate")
    long countByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT a FROM Account a WHERE a.createdAt >= :startDate AND a.createdAt < :endDate ORDER BY a.createdAt ASC")
    List<Account> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}