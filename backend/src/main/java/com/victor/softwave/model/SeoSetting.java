package com.victor.softwave.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "seo_settings")
@Data
@NoArgsConstructor
public class SeoSetting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String siteName;
    private String defaultTitle;
    
    @Column(columnDefinition = "TEXT")
    private String defaultDescription;
    
    private String defaultKeywords;
    private String defaultImage;
    private String twitterHandle;
    private String facebookAppId;
}
