package com.victor.softwave.repository;

import com.victor.softwave.model.Client;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    
    @Query("SELECT c FROM Client c WHERE " +
           "(:category IS NULL OR c.category = :category) AND " +
           "(:q IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<Client> findWithFilters(@Param("category") String category, @Param("q") String q, Pageable pageable);

    @Query("SELECT DISTINCT c.category FROM Client c WHERE c.category IS NOT NULL")
    List<String> findDistinctCategories();

    Optional<Client> findBySlug(String slug);
}
