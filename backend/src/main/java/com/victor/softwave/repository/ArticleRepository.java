package com.victor.softwave.repository;

import com.victor.softwave.model.Article;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    @Query("SELECT a FROM Article a WHERE " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:category IS NULL OR a.category = :category) AND " +
           "(:featured IS NULL OR a.featured = :featured) AND " +
           "(:search IS NULL OR LOWER(a.title) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Article> findWithFilters(@Param("status") String status, 
                                  @Param("category") String category, 
                                  @Param("featured") Boolean featured, 
                                  @Param("search") String search, 
                                  Pageable pageable);

    Optional<Article> findBySlug(String slug);
    Optional<Article> findBySlugEn(String slugEn);
}
