package com.victor.softwave.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "projects_page_content")
@Data
@NoArgsConstructor
public class ProjectsPageContent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // SEO
    private String seoTitle;
    @Column(columnDefinition = "TEXT")
    private String seoDescription;
    private String seoKeywords;
    private String primaryKeyword;

    private String seoTitleEn;
    @Column(columnDefinition = "TEXT")
    private String seoDescriptionEn;
    private String seoKeywordsEn;
    private String primaryKeywordEn;
}
