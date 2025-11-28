package com.ptit.englishlearningsuite.repository;

import com.ptit.englishlearningsuite.entity.Account;
import com.ptit.englishlearningsuite.entity.Test;
import com.ptit.englishlearningsuite.entity.TestProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TestProgressRepository extends JpaRepository<TestProgress, Long> {
    Optional<TestProgress> findByAccountAndTest(Account account, Test test);
    List<TestProgress> findAllByAccount(Account account);
    List<TestProgress> findAllByAccountOrderByCompletedAtAsc(Account account);
    int countByAccount(Account account);
    
    @Query("SELECT tp FROM TestProgress tp WHERE tp.completedAt >= :startDate AND tp.completedAt < :endDate")
    List<TestProgress> findByCompletedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}