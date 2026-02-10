package com.victor.softwave.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "project", indexes = {
        @Index(name = "idx_project_cat", columnList = "cat"),
        @Index(name = "idx_project_status", columnList = "status"),
        @Index(name = "idx_project_priority", columnList = "priority"),
        @Index(name = "idx_project_cat_status_priority", columnList = "cat,status,priority")
})
@Data
@NoArgsConstructor
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 255)
    private String title;

    @Column(length = 255)
    private String titleEn;

    @Column(length = 100)
    private String cat;

    @Column(length = 512)
    private String img;

    @Column(length = 1000)
    private String description;

    @Column(length = 1000)
    private String descriptionEn;

    @ElementCollection
    private List<String> features;

    @ElementCollection
    private List<String> technologies;

    @ElementCollection
    private List<String> gallery;

    @Column(length = 512)
    private String demoLink;

    @Column(length = 255)
    private String client;

    @Column(length = 50)
    private String completionDate;

    @Column(length = 30)
    private String status;

    @Column(length = 30)
    private String priority;

    @Column(columnDefinition = "boolean default false")
    private Boolean featured = false;

    // SEO Fields
    @Column(length = 255)
    private String seoTitle;

    @Column(length = 255)
    private String seoTitleEn;

    @Column(length = 500)
    private String seoDescription;

    @Column(length = 500)
    private String seoDescriptionEn;

    @Column(length = 255)
    private String seoKeywords;

    @Column(length = 255)
    private String seoKeywordsEn;

    @Column(length = 255, unique = true)
    private String slug;

    @Column(length = 255, unique = true)
    private String slugEn;

    @Column(updatable = false)
    private java.time.LocalDateTime createdAt;

    private java.time.LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }

    public Project(Long id,
            String title,
            String cat,
            String img,
            String description,
            List<String> features,
            List<String> technologies,
            List<String> gallery,
            String demoLink,
            String client,
            String completionDate,
            String status,
            String priority) {
        this.id = id;
        this.title = title;
        this.cat = cat;
        this.img = img;
        this.description = description;
        this.features = features;
        this.technologies = technologies;
        this.gallery = gallery;
        this.demoLink = demoLink;
        this.client = client;
        this.completionDate = completionDate;
        this.status = status;
        this.priority = priority;
    }
}
