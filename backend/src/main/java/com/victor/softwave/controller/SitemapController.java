package com.victor.softwave.controller;

import com.victor.softwave.model.Article;
import com.victor.softwave.model.Client;
import com.victor.softwave.model.Project;
import com.victor.softwave.repository.ArticleRepository;
import com.victor.softwave.repository.ClientRepository;
import com.victor.softwave.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api")
public class SitemapController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private ArticleRepository articleRepository;

    private static final String BASE_URL = "https://www.victorsoftwave.com";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public String getSitemap() {
        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
        xml.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">");

        // Static Pages
        addUrl(xml, BASE_URL + "/", "daily", "1.0");
        addUrl(xml, BASE_URL + "/thiet-ke-website", "weekly", "0.9");
        addUrl(xml, BASE_URL + "/seo-tong-the", "weekly", "0.9");
        addUrl(xml, BASE_URL + "/cham-soc-website", "weekly", "0.9");
        addUrl(xml, BASE_URL + "/tiktok-ads", "weekly", "0.8");
        addUrl(xml, BASE_URL + "/facebook-ads", "weekly", "0.8");
        addUrl(xml, BASE_URL + "/google-ads", "weekly", "0.8");
        addUrl(xml, BASE_URL + "/danh-muc-website", "weekly", "0.8"); // Portfolio
        addUrl(xml, BASE_URL + "/khach-hang-tieu-bieu", "weekly", "0.8"); // Clients
        addUrl(xml, BASE_URL + "/bai-viet", "weekly", "0.8"); // Blog
        addUrl(xml, BASE_URL + "/lien-he", "monthly", "0.7");

        // Dynamic Projects
        List<Project> projects = projectRepository.findAll();
        for (Project project : projects) {
            if (project.getSlug() != null && !project.getSlug().isEmpty()) {
                addUrl(xml, BASE_URL + "/" + project.getSlug(), "weekly", "0.8");
            }
        }

        // Dynamic Clients
        List<Client> clients = clientRepository.findAll();
        for (Client client : clients) {
            if (client.getSlug() != null && !client.getSlug().isEmpty()) {
                addUrl(xml, BASE_URL + "/" + client.getSlug(), "weekly", "0.8");
            }
        }

        // Dynamic Articles
        List<Article> articles = articleRepository.findAll();
        for (Article article : articles) {
            if (article.getSlug() != null && !article.getSlug().isEmpty()) {
                // Assuming /bai-viet/{slug} structure for articles based on PublicRoutes
                addUrl(xml, BASE_URL + "/bai-viet/" + article.getSlug(), "weekly", "0.7");
            }
        }

        xml.append("</urlset>");
        return xml.toString();
    }

    private void addUrl(StringBuilder xml, String loc, String changefreq, String priority) {
        xml.append("<url>");
        xml.append("<loc>").append(loc).append("</loc>");
        xml.append("<changefreq>").append(changefreq).append("</changefreq>");
        xml.append("<priority>").append(priority).append("</priority>");
        xml.append("<lastmod>").append(LocalDateTime.now().format(DATE_FORMATTER)).append("</lastmod>");
        xml.append("</url>");
    }
}
