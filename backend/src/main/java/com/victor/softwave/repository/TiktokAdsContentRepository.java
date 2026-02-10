package com.victor.softwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.victor.softwave.model.TiktokAdsContent;

@Repository
public interface TiktokAdsContentRepository extends JpaRepository<TiktokAdsContent, Long> {
}
