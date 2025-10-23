package com.ptit.englishlearningsuite.repository;

import com.ptit.englishlearningsuite.entity.Account;
import com.ptit.englishlearningsuite.entity.Test;
import com.ptit.englishlearningsuite.entity.TestProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TestProgressRepository extends JpaRepository<TestProgress, Long> {
    Optional<TestProgress> findByAccountAndTest(Account account, Test test);
    List<TestProgress> findAllByAccount(Account account);
}