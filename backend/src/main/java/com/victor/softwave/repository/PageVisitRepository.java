package com.victor.softwave.repository;

import com.victor.softwave.model.PageVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface PageVisitRepository extends JpaRepository<PageVisit, Long> {
    long countByVisitedAtBetween(LocalDateTime start, LocalDateTime end);
}
