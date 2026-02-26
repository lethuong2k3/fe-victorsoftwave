package com.victor.softwave.controller;

import com.victor.softwave.model.ClientsPageContent;
import com.victor.softwave.model.ProjectsPageContent;
import com.victor.softwave.repository.ClientsPageContentRepository;
import com.victor.softwave.repository.ProjectsPageContentRepository;
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

    // Projects Page Content
    @GetMapping("/projects")
    public ResponseEntity<ProjectsPageContent> getProjectsPageContent() {
        List<ProjectsPageContent> all = projectsPageContentRepository.findAll();
        if (all.isEmpty()) {
             // Return empty default
             return ResponseEntity.ok(new ProjectsPageContent());
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
}
