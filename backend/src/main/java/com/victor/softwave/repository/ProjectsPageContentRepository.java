package com.victor.softwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.victor.softwave.model.ProjectsPageContent;

@Repository
public interface ProjectsPageContentRepository extends JpaRepository<ProjectsPageContent, Long> {
}
