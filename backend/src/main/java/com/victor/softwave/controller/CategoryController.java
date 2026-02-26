package com.victor.softwave.controller;

import com.victor.softwave.model.ClientCategory;
import com.victor.softwave.model.ProjectCategory;
import com.victor.softwave.repository.ClientCategoryRepository;
import com.victor.softwave.repository.ProjectCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private ProjectCategoryRepository projectCategoryRepository;

    @Autowired
    private ClientCategoryRepository clientCategoryRepository;

    // Project Categories
    @GetMapping("/project")
    public List<ProjectCategory> getProjectCategories() {
        return projectCategoryRepository.findAll();
    }

    @PostMapping("/project")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ProjectCategory createProjectCategory(@RequestBody ProjectCategory category) {
        return projectCategoryRepository.save(category);
    }

    @PutMapping("/project/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ProjectCategory> updateProjectCategory(@PathVariable Long id, @RequestBody ProjectCategory category) {
        return projectCategoryRepository.findById(id)
                .map(existing -> {
                    existing.setName(category.getName());
                    existing.setNameEn(category.getNameEn());
                    existing.setSlug(category.getSlug());
                    return ResponseEntity.ok(projectCategoryRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/project/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteProjectCategory(@PathVariable Long id) {
        projectCategoryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // Client Categories
    @GetMapping("/client")
    public List<ClientCategory> getClientCategories() {
        return clientCategoryRepository.findAll();
    }

    @PostMapping("/client")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ClientCategory createClientCategory(@RequestBody ClientCategory category) {
        return clientCategoryRepository.save(category);
    }

    @PutMapping("/client/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ClientCategory> updateClientCategory(@PathVariable Long id, @RequestBody ClientCategory category) {
        return clientCategoryRepository.findById(id)
                .map(existing -> {
                    existing.setName(category.getName());
                    existing.setNameEn(category.getNameEn());
                    existing.setSlug(category.getSlug());
                    return ResponseEntity.ok(clientCategoryRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/client/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> deleteClientCategory(@PathVariable Long id) {
        clientCategoryRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
