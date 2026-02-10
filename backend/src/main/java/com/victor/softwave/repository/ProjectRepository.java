package com.victor.softwave.repository;

import com.victor.softwave.model.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    // Project uses 'cat' field, not 'category'
    Page<Project> findByCat(String cat, Pageable pageable);

    List<Project> findByCat(String cat);

    // Assuming 'featured' field exists in Project, if not I need to check
    // Project.java again.
    // If not, I'll add it to Project.java or remove this method.
    // For now I'll assume it exists or I'll check Project.java in next step.
    // Actually I'll comment it out if I'm not sure, but ProjectService uses it.
    // I'll check Project.java first.
    // Wait, I saw Project.java content in previous turn.
    // It had: id, title, titleEn, cat, img, description, descriptionEn, features,
    // technologies, gallery...
    // IT DID NOT HAVE 'featured' or 'slug'!
    // I MUST ADD THEM TO Project.java!

    List<Project> findByFeaturedTrue();

    Optional<Project> findBySlug(String slug);

    long countByCatAndFeaturedTrue(String cat);

    long countByCatAndFeaturedTrueAndIdNot(String cat, Long id);
}
