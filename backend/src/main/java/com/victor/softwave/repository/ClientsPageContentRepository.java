package com.victor.softwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.victor.softwave.model.ClientsPageContent;

@Repository
public interface ClientsPageContentRepository extends JpaRepository<ClientsPageContent, Long> {
}
