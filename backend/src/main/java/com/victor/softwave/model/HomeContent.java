package com.victor.softwave.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "home_content")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HomeContent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Vietnamese Fields
    @Column(length = 255)
    @Size(max = 255)
    private String badgeText;

    @Column(length = 255)
    @NotBlank
    @Size(max = 255)
    private String titlePrefix;

    @Column(length = 255)
    @NotBlank
    @Size(max = 255)
    private String titleHighlight;

    @Column(length = 255)
    @Size(max = 255)
    private String titleSuffix;

    @Column(columnDefinition = "TEXT")
    @NotBlank
    @Size(max = 1000)
    private String description;

    // Hero Image
    @Column(length = 512)
    @Size(max = 512)
    private String heroImageUrl;

    @Column(length = 50)
    @Size(max = 50)
    private String ctaPrimaryText;

    @Column(length = 50)
    @Size(max = 50)
    private String ctaSecondaryText;

    @Column(length = 100)
    @Size(max = 100)
    private String benefit1;

    @Column(length = 100)
    @Size(max = 100)
    private String benefit2;

    @Column(length = 100)
    @Size(max = 100)
    private String benefit3;

    // SEO (Vietnamese)
    @Column(length = 255)
    @Size(max = 255)
    private String seoTitle;
    @Column(columnDefinition = "TEXT")
    @Size(max = 1000)
    private String seoDescription;
    @Column(length = 500)
    @Size(max = 500)
    private String seoKeywords;
    @Column(length = 100)
    @Size(max = 100)
    private String primaryKeyword;

    // Services Section
    @Column(length = 255)
    @NotBlank
    @Size(max = 255)
    private String servicesTitle;
    @Column(columnDefinition = "TEXT")
    @Size(max = 1000)
    private String servicesDescription;
    @Column(columnDefinition = "TEXT")
    private String servicesListJsonVi;

    // Marketing Section
    @Column(length = 255)
    @Size(max = 255)
    private String marketingBadge;
    @Column(length = 255)
    @NotBlank
    @Size(max = 255)
    private String marketingTitle;
    @Column(length = 50)
    @Size(max = 50)
    private String marketingCtaText;

    // Portfolio Section
    @Column(length = 255)
    @NotBlank
    @Size(max = 255)
    private String portfolioTitle;
    @Column(length = 1000)
    @Size(max = 1000)
    private String portfolioDescription;

    // Blog Section
    @Column(length = 255)
    @NotBlank
    @Size(max = 255)
    private String blogTitle;
    @Column(length = 50)
    @Size(max = 50)
    private String blogViewAllText;

    // Contact Section
    @Column(length = 255)
    @NotBlank
    @Size(max = 255)
    private String contactTitle;
    @Column(columnDefinition = "TEXT")
    @Size(max = 1000)
    private String contactDescription;
    @Column(length = 50)
    @Size(max = 50)
    private String contactHotlineLabel;
    @Column(length = 50)
    @Size(max = 50)
    private String contactEmailLabel;
    @Column(length = 50)
    private String contactAddressLabel;

    @Column(length = 255)
    @Size(max = 255)
    private String contactAddressValue;

    @Column(length = 50)
    private String contactHotline;

    @Column(length = 100)
    private String contactEmail;

    @Column(columnDefinition = "TEXT")
    private String contactMapUrl;

    // English Fields
    @Column(length = 255)
    private String badgeTextEn;

    @Column(length = 255)
    private String titlePrefixEn;

    @Column(length = 255)
    private String titleHighlightEn;

    @Column(length = 255)
    private String titleSuffixEn;

    @Column(length = 1000)
    private String descriptionEn;

    // Hero Image En (optional separate per language)
    @Column(length = 512)
    private String heroImageUrlEn;

    @Column(length = 50)
    private String ctaPrimaryTextEn;

    @Column(length = 50)
    private String ctaSecondaryTextEn;

    @Column(length = 100)
    private String benefit1En;

    @Column(length = 100)
    private String benefit2En;

    @Column(length = 100)
    private String benefit3En;

    // SEO (English)
    @Column(length = 255)
    private String seoTitleEn;
    @Column(columnDefinition = "TEXT")
    private String seoDescriptionEn;
    @Column(length = 500)
    private String seoKeywordsEn;
    @Column(length = 100)
    private String primaryKeywordEn;

    // Services Section En
    @Column(length = 255)
    private String servicesTitleEn;
    @Column(length = 1000)
    private String servicesDescriptionEn;
    @Column(columnDefinition = "TEXT")
    private String servicesListJsonEn;

    // Marketing Section En
    @Column(length = 255)
    private String marketingBadgeEn;
    @Column(length = 255)
    private String marketingTitleEn;
    @Column(length = 50)
    private String marketingCtaTextEn;

    // Marketing Platforms (JSON per language)
    @Column(columnDefinition = "TEXT")
    private String marketingPlatformsJsonVi;
    @Column(columnDefinition = "TEXT")
    private String marketingPlatformsJsonEn;

    // Portfolio Section En
    @Column(length = 255)
    private String portfolioTitleEn;
    @Column(length = 1000)
    private String portfolioDescriptionEn;

    // Blog Section En
    @Column(length = 255)
    private String blogTitleEn;
    @Column(length = 50)
    private String blogViewAllTextEn;

    // Contact Section En
    @Column(length = 255)
    private String contactTitleEn;
    @Column(columnDefinition = "TEXT")
    private String contactDescriptionEn;
    @Column(length = 50)
    private String contactHotlineLabelEn;
    @Column(length = 50)
    private String contactEmailLabelEn;
    @Column(length = 50)
    private String contactAddressLabelEn;
    @Column(length = 255)
    private String contactAddressValueEn;

    // Social / Floating Contact
    @Column(length = 255)
    private String zaloUrl;
    @Column(length = 255)
    private String facebookUrl; // Fanpage URL
    @Column(length = 255)
    private String messengerUrl;
    @Column(length = 255)
    private String adminChatUrl;

    // Explicit Getters and Setters to avoid Lombok issues with older compilers or
    // IDEs
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBadgeText() {
        return badgeText;
    }

    public void setBadgeText(String badgeText) {
        this.badgeText = badgeText;
    }

    public String getTitlePrefix() {
        return titlePrefix;
    }

    public void setTitlePrefix(String titlePrefix) {
        this.titlePrefix = titlePrefix;
    }

    public String getTitleHighlight() {
        return titleHighlight;
    }

    public void setTitleHighlight(String titleHighlight) {
        this.titleHighlight = titleHighlight;
    }

    public String getTitleSuffix() {
        return titleSuffix;
    }

    public void setTitleSuffix(String titleSuffix) {
        this.titleSuffix = titleSuffix;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCtaPrimaryText() {
        return ctaPrimaryText;
    }

    public void setCtaPrimaryText(String ctaPrimaryText) {
        this.ctaPrimaryText = ctaPrimaryText;
    }

    public String getCtaSecondaryText() {
        return ctaSecondaryText;
    }

    public void setCtaSecondaryText(String ctaSecondaryText) {
        this.ctaSecondaryText = ctaSecondaryText;
    }

    public String getBenefit1() {
        return benefit1;
    }

    public void setBenefit1(String benefit1) {
        this.benefit1 = benefit1;
    }

    public String getBenefit2() {
        return benefit2;
    }

    public void setBenefit2(String benefit2) {
        this.benefit2 = benefit2;
    }

    public String getBenefit3() {
        return benefit3;
    }

    public void setBenefit3(String benefit3) {
        this.benefit3 = benefit3;
    }

    public String getContactAddressValue() {
        return contactAddressValue;
    }

    public void setContactAddressValue(String contactAddressValue) {
        this.contactAddressValue = contactAddressValue;
    }

    public String getContactMapUrl() {
        return contactMapUrl;
    }

    public void setContactMapUrl(String contactMapUrl) {
        this.contactMapUrl = contactMapUrl;
    }

    public String getBadgeTextEn() {
        return badgeTextEn;
    }

    public void setBadgeTextEn(String badgeTextEn) {
        this.badgeTextEn = badgeTextEn;
    }

    public String getTitlePrefixEn() {
        return titlePrefixEn;
    }

    public void setTitlePrefixEn(String titlePrefixEn) {
        this.titlePrefixEn = titlePrefixEn;
    }

    public String getTitleHighlightEn() {
        return titleHighlightEn;
    }

    public void setTitleHighlightEn(String titleHighlightEn) {
        this.titleHighlightEn = titleHighlightEn;
    }

    public String getTitleSuffixEn() {
        return titleSuffixEn;
    }

    public void setTitleSuffixEn(String titleSuffixEn) {
        this.titleSuffixEn = titleSuffixEn;
    }

    public String getDescriptionEn() {
        return descriptionEn;
    }

    public void setDescriptionEn(String descriptionEn) {
        this.descriptionEn = descriptionEn;
    }

    public String getCtaPrimaryTextEn() {
        return ctaPrimaryTextEn;
    }

    public void setCtaPrimaryTextEn(String ctaPrimaryTextEn) {
        this.ctaPrimaryTextEn = ctaPrimaryTextEn;
    }

    public String getCtaSecondaryTextEn() {
        return ctaSecondaryTextEn;
    }

    public void setCtaSecondaryTextEn(String ctaSecondaryTextEn) {
        this.ctaSecondaryTextEn = ctaSecondaryTextEn;
    }

    public String getBenefit1En() {
        return benefit1En;
    }

    public void setBenefit1En(String benefit1En) {
        this.benefit1En = benefit1En;
    }

    public String getBenefit2En() {
        return benefit2En;
    }

    public void setBenefit2En(String benefit2En) {
        this.benefit2En = benefit2En;
    }

    public String getBenefit3En() {
        return benefit3En;
    }

    public void setBenefit3En(String benefit3En) {
        this.benefit3En = benefit3En;
    }

    public String getServicesListJsonVi() {
        return servicesListJsonVi;
    }

    public void setServicesListJsonVi(String servicesListJsonVi) {
        this.servicesListJsonVi = servicesListJsonVi;
    }

    public String getServicesListJsonEn() {
        return servicesListJsonEn;
    }

    public void setServicesListJsonEn(String servicesListJsonEn) {
        this.servicesListJsonEn = servicesListJsonEn;
    }

    public String getContactAddressValueEn() {
        return contactAddressValueEn;
    }

    public void setContactAddressValueEn(String contactAddressValueEn) {
        this.contactAddressValueEn = contactAddressValueEn;
    }

    public String getContactHotline() {
        return contactHotline;
    }

    public void setContactHotline(String contactHotline) {
        this.contactHotline = contactHotline;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getZaloUrl() {
        return zaloUrl;
    }

    public void setZaloUrl(String zaloUrl) {
        this.zaloUrl = zaloUrl;
    }

    public String getFacebookUrl() {
        return facebookUrl;
    }

    public void setFacebookUrl(String facebookUrl) {
        this.facebookUrl = facebookUrl;
    }

    public String getMessengerUrl() {
        return messengerUrl;
    }

    public void setMessengerUrl(String messengerUrl) {
        this.messengerUrl = messengerUrl;
    }

    public String getAdminChatUrl() {
        return adminChatUrl;
    }

    public void setAdminChatUrl(String adminChatUrl) {
        this.adminChatUrl = adminChatUrl;
    }
}
