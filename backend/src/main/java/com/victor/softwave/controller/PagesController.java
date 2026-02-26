package com.victor.softwave.controller;

import com.victor.softwave.model.ClientsPageContent;
import com.victor.softwave.model.ProjectsPageContent;
import com.victor.softwave.model.WebsiteCareContent;
import com.victor.softwave.model.TiktokAdsContent;
import com.victor.softwave.model.FacebookAdsContent;
import com.victor.softwave.model.GoogleAdsContent;
import com.victor.softwave.repository.ClientsPageContentRepository;
import com.victor.softwave.repository.ProjectsPageContentRepository;
import com.victor.softwave.repository.WebsiteCareContentRepository;
import com.victor.softwave.repository.TiktokAdsContentRepository;
import com.victor.softwave.repository.FacebookAdsContentRepository;
import com.victor.softwave.repository.GoogleAdsContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pages")
public class PagesController {

    @Autowired
    private ProjectsPageContentRepository projectsPageContentRepository;

    @Autowired
    private ClientsPageContentRepository clientsPageContentRepository;

    @Autowired
    private WebsiteCareContentRepository websiteCareContentRepository;

    @Autowired
    private TiktokAdsContentRepository tiktokAdsContentRepository;

    @Autowired
    private FacebookAdsContentRepository facebookAdsContentRepository;

    @Autowired
    private GoogleAdsContentRepository googleAdsContentRepository;

    // Projects Page Content
    @GetMapping("/projects")
    public ResponseEntity<ProjectsPageContent> getProjectsPageContent(
            @RequestParam(value = "lang", required = false) String lang) {
        List<ProjectsPageContent> all = projectsPageContentRepository.findAll();
        if (all.isEmpty()) {
            ProjectsPageContent empty = new ProjectsPageContent();
            empty.setPageTitle("Dự án tiêu biểu");
            empty.setPageTitleEn("Featured Projects");
            empty.setPageDescription("Khám phá các dự án chúng tôi đã thực hiện.");
            empty.setPageDescriptionEn("Explore the projects we have delivered.");

            empty.setSeoTitle("Dự án | Victor Software");
            empty.setSeoTitleEn("Projects | Victor Software");

            empty.setSeoKeywords("dự án, phần mềm, website, mobile app");
            empty.setSeoKeywordsEn("projects, software, website, mobile app");

            empty.setSeoDescription(
                    "Danh sách các dự án phần mềm, website, mobile app đã thực hiện bởi Victor Software.");
            empty.setSeoDescriptionEn("List of software, website, mobile app projects delivered by Victor Software.");

            empty.setHeroImageUrl("");
            empty.setHeroImageUrlEn("");

            return ResponseEntity.ok()
                    .header("Content-Language", lang != null && lang.equalsIgnoreCase("en") ? "en" : "vi")
                    .body(empty);
        }
        return ResponseEntity.ok(all.get(0));
    }

    @PostMapping("/projects")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ProjectsPageContent> saveProjectsPageContent(@RequestBody ProjectsPageContent content) {
        List<ProjectsPageContent> all = projectsPageContentRepository.findAll();
        if (!all.isEmpty()) {
            content.setId(all.get(0).getId());
        } else {
            content.setId(null);
        }
        return ResponseEntity.ok(projectsPageContentRepository.save(content));
    }

    // Clients Page Content
    @GetMapping("/clients")
    public ResponseEntity<ClientsPageContent> getClientsPageContent() {
        List<ClientsPageContent> all = clientsPageContentRepository.findAll();
        if (all.isEmpty()) {
            return ResponseEntity.ok(new ClientsPageContent());
        }
        return ResponseEntity.ok(all.get(0));
    }

    @PostMapping("/clients")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ClientsPageContent> saveClientsPageContent(@RequestBody ClientsPageContent content) {
        List<ClientsPageContent> all = clientsPageContentRepository.findAll();
        if (!all.isEmpty()) {
            content.setId(all.get(0).getId());
        } else {
            content.setId(null);
        }
        return ResponseEntity.ok(clientsPageContentRepository.save(content));
    }

    // Website Care Content
    @GetMapping("/website-care")
    public ResponseEntity<WebsiteCareContent> getWebsiteCareContent() {
        List<WebsiteCareContent> all = websiteCareContentRepository.findAll();
        if (all.isEmpty()) {
            return ResponseEntity.ok(new WebsiteCareContent());
        }
        return ResponseEntity.ok(all.get(0));
    }

    @PostMapping("/website-care")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<WebsiteCareContent> saveWebsiteCareContent(@RequestBody WebsiteCareContent content) {
        List<WebsiteCareContent> all = websiteCareContentRepository.findAll();
        if (!all.isEmpty()) {
            content.setId(all.get(0).getId());
        } else {
            content.setId(null);
        }
        return ResponseEntity.ok(websiteCareContentRepository.save(content));
    }

    // Tiktok Ads Content
    @GetMapping("/tiktok-ads")
    public ResponseEntity<TiktokAdsContent> getTiktokAdsContent() {
        List<TiktokAdsContent> all = tiktokAdsContentRepository.findAll();
        if (all.isEmpty()) {
            return ResponseEntity.ok(new TiktokAdsContent());
        }
        return ResponseEntity.ok(all.get(0));
    }

    @PostMapping("/tiktok-ads")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<TiktokAdsContent> saveTiktokAdsContent(@RequestBody TiktokAdsContent content) {
        List<TiktokAdsContent> all = tiktokAdsContentRepository.findAll();
        if (!all.isEmpty()) {
            content.setId(all.get(0).getId());
        } else {
            content.setId(null);
        }
        return ResponseEntity.ok(tiktokAdsContentRepository.save(content));
    }

    // Facebook Ads Content
    @GetMapping("/facebook-ads")
    public ResponseEntity<FacebookAdsContent> getFacebookAdsContent() {
        List<FacebookAdsContent> all = facebookAdsContentRepository.findAll();
        if (all.isEmpty()) {
            return ResponseEntity.ok(new FacebookAdsContent());
        }
        return ResponseEntity.ok(all.get(0));
    }

    @PostMapping("/facebook-ads")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<FacebookAdsContent> saveFacebookAdsContent(@RequestBody FacebookAdsContent content) {
        List<FacebookAdsContent> all = facebookAdsContentRepository.findAll();
        if (!all.isEmpty()) {
            content.setId(all.get(0).getId());
        } else {
            content.setId(null);
        }
        return ResponseEntity.ok(facebookAdsContentRepository.save(content));
    }

    // Google Ads Content
    @GetMapping("/google-ads")
    public ResponseEntity<GoogleAdsContent> getGoogleAdsContent() {
        List<GoogleAdsContent> all = googleAdsContentRepository.findAll();
        if (all.isEmpty()) {
            return ResponseEntity.ok(new GoogleAdsContent());
        }
        return ResponseEntity.ok(all.get(0));
    }

    @PostMapping("/google-ads")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<GoogleAdsContent> saveGoogleAdsContent(@RequestBody GoogleAdsContent content) {
        List<GoogleAdsContent> all = googleAdsContentRepository.findAll();
        if (!all.isEmpty()) {
            content.setId(all.get(0).getId());
        } else {
            content.setId(null);
        }
        return ResponseEntity.ok(googleAdsContentRepository.save(content));
    }
}
