package com.ptit.englishlearningsuite.repository;

import com.ptit.englishlearningsuite.entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestRepository extends JpaRepository<Test, Long> {
}