package com.victor.softwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.victor.softwave.model.FacebookAdsContent;

@Repository
public interface FacebookAdsContentRepository extends JpaRepository<FacebookAdsContent, Long> {
}
