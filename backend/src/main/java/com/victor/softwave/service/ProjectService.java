package com.victor.softwave.service;

import com.victor.softwave.model.Project;
import com.victor.softwave.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public Page<Project> getProjectsPage(int page, int size, String category) {
        if (category != null && !category.isEmpty()) {
            return projectRepository.findByCat(category, PageRequest.of(page, size));
        }
        return projectRepository.findAll(PageRequest.of(page, size));
    }

    public List<Project> getProjectsByCategory(String category) {
        return projectRepository.findByCat(category);
    }

    public List<Project> getFeaturedProjects() {
        return projectRepository.findByFeaturedTrue();
    }

    public Optional<Project> getProjectBySlug(String slug) {
        return projectRepository.findBySlug(slug);
    }

    // Admin methods
    public Page<Project> getProjectsWithFilters(int page, int size, String search, String category, String status,
            String priority) {
        // Simple implementation for now, ignoring complex filters if not supported by
        // repo yet
        // Ideally we should use Specification or QueryDSL
        Pageable pageable = PageRequest.of(page, size);
        if (category != null && !category.isEmpty()) {
            return projectRepository.findByCat(category, pageable);
        }
        return projectRepository.findAll(pageable);
    }

    public List<String> getProjectCategories(String search) {
        // Return distinct categories
        return projectRepository.findAll().stream()
                .map(Project::getCat)
                .distinct()
                .filter(c -> search == null || c.toLowerCase().contains(search.toLowerCase()))
                .collect(Collectors.toList());
    }

    public long countByCatAndFeaturedTrue(String cat) {
        return projectRepository.countByCatAndFeaturedTrue(cat);
    }

    public long countByCatAndFeaturedTrueAndIdNot(String cat, Long id) {
        return projectRepository.countByCatAndFeaturedTrueAndIdNot(cat, id);
    }

    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    public Optional<Project> getProjectById(Long id) {
        return projectRepository.findById(id);
    }

    public boolean existsById(Long id) {
        return projectRepository.existsById(id);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}
