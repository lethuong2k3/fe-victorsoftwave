package com.victor.softwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.victor.softwave.model.WebDesignContent;

@Repository
public interface WebDesignContentRepository extends JpaRepository<WebDesignContent, Long> {
}
