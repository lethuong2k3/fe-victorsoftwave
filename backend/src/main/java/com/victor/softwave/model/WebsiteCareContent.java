package com.victor.softwave.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "website_care_content")
@Data
@NoArgsConstructor
public class WebsiteCareContent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String heroTitlePrefix;
    private String heroTitleHighlight;
    private String heroDescription;
    private String heroTitlePrefixEn;
    private String heroTitleHighlightEn;
    private String heroDescriptionEn;
    private String heroImageUrl;
    private String heroImageUrlEn;

    @Column(columnDefinition = "TEXT")
    private String serviceDescriptionHtml;

    @Column(columnDefinition = "TEXT")
    private String serviceDescriptionHtmlEn;

    @Column(columnDefinition = "TEXT")
    private String suitableFor;

    @Column(columnDefinition = "TEXT")
    private String suitableForEn;

    @Column(columnDefinition = "TEXT")
    private String suggestionText;

    @Column(columnDefinition = "TEXT")
    private String suggestionTextEn;

    // Plans (stored as JSON)
    private String plansTitle;
    private String plansTitleEn;

    @Column(columnDefinition = "TEXT")
    private String plansDescription;

    @Column(columnDefinition = "TEXT")
    private String plansDescriptionEn;

    @Column(columnDefinition = "TEXT")
    private String plansJson;

    @Column(columnDefinition = "TEXT")
    private String plansJsonEn;

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

    // Legacy fields
    @Column(columnDefinition = "TEXT")
    private String serviceIntro;
    @Column(columnDefinition = "TEXT")
    private String serviceSecondary;
}
