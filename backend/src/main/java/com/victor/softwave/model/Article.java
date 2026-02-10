package com.victor.softwave.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "articles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String titleEn;

    @Column(unique = true)
    private String slug;

    @Column(unique = true)
    private String slugEn;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(columnDefinition = "TEXT")
    private String contentEn;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String descriptionEn;

    private String status; // PUBLISHED, DRAFT
    private String category;
    private String categoryEn;
    private Boolean featured;
    private String image;
    private String author;

    // SEO
    private String seoTitle;
    private String seoTitleEn;
    @Column(columnDefinition = "TEXT")
    private String seoDescription;
    @Column(columnDefinition = "TEXT")
    private String seoDescriptionEn;
    private String seoKeywords;
    private String seoKeywordsEn;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
