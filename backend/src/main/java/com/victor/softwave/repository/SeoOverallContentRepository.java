package com.victor.softwave.repository;

import com.victor.softwave.model.SeoOverallContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SeoOverallContentRepository extends JpaRepository<SeoOverallContent, Long> {
}
