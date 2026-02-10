package com.victor.softwave.controller;

import com.victor.softwave.model.Project;
import com.victor.softwave.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/projects")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String cat,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String q) {

        Page<Project> result = projectService.getProjectsWithFilters(page, size, cat, status, priority, q);

        Map<String, Object> body = new HashMap<>();
        body.put("content", result.getContent());
        body.put("page", result.getNumber());
        body.put("size", result.getSize());
        body.put("totalElements", result.getTotalElements());
        body.put("totalPages", result.getTotalPages());
        return ResponseEntity.ok(body);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories(@RequestParam(required = false) String q) {
        List<String> cats = projectService.getProjectCategories(q);
        return ResponseEntity.ok(cats);
    }

    @PostMapping
    public ResponseEntity<?> createProject(@RequestBody Project project) {
        if (Boolean.TRUE.equals(project.getFeatured())) {
            long count = projectService.countByCatAndFeaturedTrue(project.getCat());
            if (count >= 6) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Mỗi danh mục chỉ được tối đa 6 dự án nổi bật."));
            }
        }
        project.setId(null);
        Project saved = projectService.saveProject(project);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProject(@PathVariable @NonNull Long id, @RequestBody Project project) {
        return projectService.getProjectById(id)
                .map(existing -> {
                    if (Boolean.TRUE.equals(project.getFeatured())) {
                        long count = projectService.countByCatAndFeaturedTrueAndIdNot(project.getCat(), id);
                        if (count >= 6) {
                            return ResponseEntity.badRequest()
                                    .body(Map.of("message", "Mỗi danh mục chỉ được tối đa 6 dự án nổi bật."));
                        }
                    }
                    project.setId(existing.getId());
                    Project saved = projectService.saveProject(project);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable @NonNull Long id) {
        if (!projectService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}
