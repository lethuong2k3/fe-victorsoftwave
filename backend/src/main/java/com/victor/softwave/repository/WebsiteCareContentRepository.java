package com.victor.softwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.victor.softwave.model.WebsiteCareContent;

@Repository
public interface WebsiteCareContentRepository extends JpaRepository<WebsiteCareContent, Long> {
}
