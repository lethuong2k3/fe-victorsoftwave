package com.victor.softwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.victor.softwave.model.HomeContent;

@Repository
public interface HomeContentRepository extends JpaRepository<HomeContent, Long> {
}
