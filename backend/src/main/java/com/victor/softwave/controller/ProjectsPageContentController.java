package com.victor.softwave.controller;

import com.victor.softwave.model.ProjectsPageContent;
import com.victor.softwave.repository.ProjectsPageContentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;

import java.util.List;

@RestController
@RequestMapping("/api/pages/projects")
public class ProjectsPageContentController {

    @Autowired
    private ProjectsPageContentRepository projectsPageContentRepository;

    @GetMapping
    public ResponseEntity<ProjectsPageContent> getContent(
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
            
            empty.setSeoDescription("Danh sách các dự án phần mềm, website, mobile app đã thực hiện bởi Victor Software.");
            empty.setSeoDescriptionEn("List of software, website, mobile app projects delivered by Victor Software.");
            
            empty.setHeroImageUrl("");
            empty.setHeroImageUrlEn("");
            
            return ResponseEntity.ok()
                    .header("Content-Language", lang != null && lang.equalsIgnoreCase("en") ? "en" : "vi")
                    .body(empty);
        }
        return ResponseEntity.ok(all.get(0));
    }

    @PostMapping
    public ResponseEntity<ProjectsPageContent> saveContent(@RequestBody @NonNull ProjectsPageContent content) {
        List<ProjectsPageContent> all = projectsPageContentRepository.findAll();
        if (!all.isEmpty()) {
            ProjectsPageContent existing = all.get(0);
            content.setId(existing.getId());
        } else {
            content.setId(null);
        }
        ProjectsPageContent saved = projectsPageContentRepository.save(content);
        return ResponseEntity.ok(saved);
    }
}
