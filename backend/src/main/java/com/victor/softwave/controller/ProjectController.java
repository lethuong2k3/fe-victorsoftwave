package com.victor.softwave.controller;

import com.victor.softwave.model.Project;
import com.victor.softwave.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public ResponseEntity<?> getAllProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String category) {
        Page<Project> result = projectService.getProjectsPage(page, size, category);
        Map<String, Object> body = new HashMap<>();
        body.put("content", result.getContent());
        body.put("page", result.getNumber());
        body.put("size", result.getSize());
        body.put("totalElements", result.getTotalElements());
        body.put("totalPages", result.getTotalPages());
        return ResponseEntity.ok(body);
    }

    @GetMapping("/category/{cat}")
    public List<Project> getProjectsByCategory(@PathVariable @NonNull String cat) {
        return projectService.getProjectsByCategory(cat);
    }

    @GetMapping("/featured")
    public List<Project> getFeaturedProjects() {
        return projectService.getFeaturedProjects();
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Project> getProjectBySlug(@PathVariable @NonNull String slug) {
        return projectService.getProjectBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Project createProject(@RequestBody @NonNull Project project) {
        return projectService.saveProject(project);
    }
}
