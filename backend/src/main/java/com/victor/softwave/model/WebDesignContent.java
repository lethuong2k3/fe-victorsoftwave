package com.victor.softwave.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "web_design_content")
@Data
@NoArgsConstructor
public class WebDesignContent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String heroTitlePrefix;
    private String heroTitleHighlight;
    private String heroDescription;
    private String heroTitlePrefixEn;
    private String heroTitleHighlightEn;
    private String heroDescriptionEn;

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

    @Column(columnDefinition = "TEXT")
    private String pricingJsonVi;

    @Column(columnDefinition = "TEXT")
    private String pricingJsonEn;
}
