package com.victor.softwave.controller;

import com.victor.softwave.model.*;
import com.victor.softwave.repository.*;
import com.victor.softwave.service.ArticleService;
import com.victor.softwave.service.ClientService;
import com.victor.softwave.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/public/seo-meta")
public class PublicSeoController {

    @Autowired
    private ArticleService articleService;

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ClientService clientService;

    @Autowired
    private HomeContentRepository homeContentRepository;

    @Autowired
    private WebDesignContentRepository webDesignContentRepository;

    @Autowired
    private SeoOverallContentRepository seoOverallContentRepository;

    @Autowired
    private WebsiteCareContentRepository websiteCareContentRepository;

    @Autowired
    private GoogleAdsContentRepository googleAdsContentRepository;

    @Autowired
    private FacebookAdsContentRepository facebookAdsContentRepository;

    @Autowired
    private TiktokAdsContentRepository tiktokAdsContentRepository;

    @Autowired
    private ClientsPageContentRepository clientsPageContentRepository;

    @Autowired
    private ProjectsPageContentRepository projectsPageContentRepository;

    @GetMapping(produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> getSeoMeta(@RequestParam String path) {
        String title = "Victor Software - Giải Pháp Số Toàn Diện";
        String description = "Chuyên cung cấp giải pháp thiết kế website, phần mềm và marketing online chuyên nghiệp.";
        String image = "https://www.victorsoftwave.com/logo.png";
        String url = "https://www.victorsoftwave.com" + (path.startsWith("/") ? path : "/" + path);
        String type = "website";

        boolean isEn = path.contains("/en/") || path.equals("/en");

        // Logic to detect content based on path
        if (path.contains("/bai-viet/") || path.contains("/blog/")) {
            // Article Detail
            String slug = extractSlug(path);
            if (slug != null) {
                Optional<Article> articleOpt = articleService.getArticleBySlug(slug);
                if (articleOpt.isEmpty()) {
                    articleOpt = articleService.getArticleBySlugEn(slug);
                }

                if (articleOpt.isPresent()) {
                    Article article = articleOpt.get();
                    title = isEn ? (article.getSeoTitleEn() != null ? article.getSeoTitleEn() : article.getTitleEn())
                            : (article.getSeoTitle() != null ? article.getSeoTitle() : article.getTitle());

                    description = isEn
                            ? (article.getSeoDescriptionEn() != null ? article.getSeoDescriptionEn()
                                    : article.getDescriptionEn())
                            : (article.getSeoDescription() != null ? article.getSeoDescription()
                                    : article.getDescription());

                    if (article.getImage() != null && !article.getImage().isEmpty()) {
                        image = resolveImageUrl(article.getImage());
                    }
                    type = "article";
                }
            }
        } else if (path.matches(".*/(danh-muc-website|portfolio|du-an|projects)/.+")) {
            // Project Detail
            String slug = extractSlug(path);
            if (slug != null) {
                Optional<Project> projectOpt = projectService.getProjectBySlug(slug);
                if (projectOpt.isPresent()) {
                    Project project = projectOpt.get();
                    title = isEn ? (project.getSeoTitleEn() != null ? project.getSeoTitleEn() : project.getTitleEn())
                            : (project.getSeoTitle() != null ? project.getSeoTitle() : project.getTitle());

                    description = isEn
                            ? (project.getSeoDescriptionEn() != null ? project.getSeoDescriptionEn()
                                    : project.getDescriptionEn())
                            : (project.getSeoDescription() != null ? project.getSeoDescription()
                                    : project.getDescription());

                    if (project.getImg() != null && !project.getImg().isEmpty()) {
                        image = resolveImageUrl(project.getImg());
                    }
                    type = "article";
                }
            }
        } else if (path.matches(".*/(khach-hang|clients)/.+")) {
            // Client Detail
            String slug = extractSlug(path);
            if (slug != null) {
                Optional<Client> clientOpt = clientService.getClientBySlug(slug);
                if (clientOpt.isPresent()) {
                    Client client = clientOpt.get();
                    // Client entity doesn't have specific SEO fields, fallback to name/category
                    title = client.getName() + (isEn ? " - Valued Client" : " - Khách Hàng Tiêu Biểu");
                    description = (isEn ? "Project for " : "Dự án cho ") + client.getName() + " - "
                            + client.getCategory();

                    if (client.getLogo() != null && !client.getLogo().isEmpty()) {
                        image = resolveImageUrl(client.getLogo());
                    }
                }
            }
        } else if (path.contains("thiet-ke-website") || path.contains("web-design")) {
            Optional<WebDesignContent> content = webDesignContentRepository.findById(1L);
            if (content.isPresent()) {
                WebDesignContent c = content.get();
                title = isEn ? c.getSeoTitleEn() : c.getSeoTitle();
                description = isEn ? c.getSeoDescriptionEn() : c.getSeoDescription();
            }
        } else if (path.contains("seo-tong-the") || path.contains("seo-overall")) {
            Optional<SeoOverallContent> content = seoOverallContentRepository.findById(1L);
            if (content.isPresent()) {
                SeoOverallContent c = content.get();
                title = isEn ? c.getSeoTitleEn() : c.getSeoTitle();
                description = isEn ? c.getSeoDescriptionEn() : c.getSeoDescription();
            }
        } else if (path.contains("cham-soc-website") || path.contains("website-care")) {
            Optional<WebsiteCareContent> content = websiteCareContentRepository.findById(1L);
            if (content.isPresent()) {
                WebsiteCareContent c = content.get();
                title = isEn ? c.getSeoTitleEn() : c.getSeoTitle();
                description = isEn ? c.getSeoDescriptionEn() : c.getSeoDescription();
            }
        } else if (path.contains("quang-cao-google") || path.contains("google-ads")) {
            Optional<GoogleAdsContent> content = googleAdsContentRepository.findById(1L);
            if (content.isPresent()) {
                GoogleAdsContent c = content.get();
                title = isEn ? c.getSeoTitleEn() : c.getSeoTitle();
                description = isEn ? c.getSeoDescriptionEn() : c.getSeoDescription();
            }
        } else if (path.contains("quang-cao-facebook") || path.contains("facebook-ads")) {
            Optional<FacebookAdsContent> content = facebookAdsContentRepository.findById(1L);
            if (content.isPresent()) {
                FacebookAdsContent c = content.get();
                title = isEn ? c.getSeoTitleEn() : c.getSeoTitle();
                description = isEn ? c.getSeoDescriptionEn() : c.getSeoDescription();
            }
        } else if (path.contains("quang-cao-tiktok") || path.contains("tiktok-ads")) {
            Optional<TiktokAdsContent> content = tiktokAdsContentRepository.findById(1L);
            if (content.isPresent()) {
                TiktokAdsContent c = content.get();
                title = isEn ? c.getSeoTitleEn() : c.getSeoTitle();
                description = isEn ? c.getSeoDescriptionEn() : c.getSeoDescription();
            }
        } else if (path.endsWith("/khach-hang") || path.endsWith("/clients")) {
            Optional<ClientsPageContent> content = clientsPageContentRepository.findById(1L);
            if (content.isPresent()) {
                ClientsPageContent c = content.get();
                title = isEn ? c.getSeoTitleEn() : c.getSeoTitle();
                description = isEn ? c.getSeoDescriptionEn() : c.getSeoDescription();
            }
        } else if (path.endsWith("/du-an") || path.endsWith("/projects") || path.endsWith("/danh-muc-website")
                || path.endsWith("/portfolio")) {
            // Check ProjectsPageContent
            Optional<ProjectsPageContent> content = projectsPageContentRepository.findById(1L);
            if (content.isPresent()) {
                ProjectsPageContent c = content.get();
                title = isEn ? c.getSeoTitleEn() : c.getSeoTitle();
                description = isEn ? c.getSeoDescriptionEn() : c.getSeoDescription();
            }
        } else if (path.equals("/") || path.equals("/en") || path.equals("/vi")) {
            Optional<HomeContent> content = homeContentRepository.findById(1L);
            if (content.isPresent()) {
                HomeContent c = content.get();
                title = isEn ? c.getSeoTitleEn() : c.getSeoTitle(); // Note: HomeContent might use 'seoTitleEn' vs
                                                                    // 'titleSuffixEn' etc. checking model
                // HomeContent model has seoTitleEn.
                description = isEn ? c.getSeoDescriptionEn() : c.getSeoDescription();
            }
        }

        // Fallback for nulls
        if (title == null)
            title = "Victor Software - Giải Pháp Số Toàn Diện";
        if (description == null)
            description = "Chuyên cung cấp giải pháp thiết kế website, phần mềm và marketing online chuyên nghiệp.";
        if (image == null)
            image = "https://www.victorsoftwave.com/logo.png";

        // Generate HTML
        String html = String.format("""
                <!DOCTYPE html>
                <html lang="%s">
                <head>
                    <meta charset="UTF-8">
                    <title>%s</title>
                    <meta name="description" content="%s">
                    <meta property="og:site_name" content="Victor Software">
                    <meta property="og:title" content="%s">
                    <meta property="og:description" content="%s">
                    <meta property="og:image" content="%s">
                    <meta property="og:image:width" content="1200">
                    <meta property="og:image:height" content="630">
                    <meta property="og:url" content="%s">
                    <meta property="og:type" content="%s">
                    <meta name="twitter:card" content="summary_large_image">
                    <meta name="twitter:title" content="%s">
                    <meta name="twitter:description" content="%s">
                    <meta name="twitter:image" content="%s">
                </head>
                <body>
                </body>
                </html>
                """,
                isEn ? "en" : "vi",
                escapeHtml(title),
                escapeHtml(description),
                escapeHtml(title),
                escapeHtml(description),
                image,
                url,
                type,
                escapeHtml(title),
                escapeHtml(description),
                image);

        return ResponseEntity.ok(html);
    }

    private String extractSlug(String path) {
        if (path.endsWith("/")) {
            path = path.substring(0, path.length() - 1);
        }
        int lastSlashIndex = path.lastIndexOf("/");
        if (lastSlashIndex != -1 && lastSlashIndex < path.length() - 1) {
            return path.substring(lastSlashIndex + 1);
        }
        return null;
    }

    private String resolveImageUrl(String imgPath) {
        if (imgPath == null || imgPath.isEmpty())
            return "https://www.victorsoftwave.com/logo.png";
        if (imgPath.startsWith("http"))
            return imgPath;
        return "https://www.victorsoftwave.com" + (imgPath.startsWith("/") ? "" : "/") + imgPath;
    }

    private String escapeHtml(String input) {
        if (input == null)
            return "";
        return input.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
