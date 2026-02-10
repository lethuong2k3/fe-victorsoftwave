package com.victor.softwave.controller;

import com.victor.softwave.model.Article;
import com.victor.softwave.service.ArticleService;
import org.springframework.lang.NonNull;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @GetMapping
    public ResponseEntity<Page<Article>> getArticles(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(articleService.getArticles(status, category, featured, search, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable @NonNull Long id) {
        Optional<Article> article = articleService.getArticleById(Objects.requireNonNull(id));
        return article.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<Article> getArticleBySlug(@PathVariable @NonNull String slug) {
        Optional<Article> article = articleService.getArticleBySlug(Objects.requireNonNull(slug));
        if (article.isEmpty()) {
            article = articleService.getArticleBySlugEn(slug);
        }
        return article.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // I'll rewrite this method properly after checking service capabilities or just
    // inject repo if needed.
    // Actually, I should just implement standard CRUD first.

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Article> createArticle(@RequestBody Article article) {
        return ResponseEntity.ok(articleService.saveArticle(Objects.requireNonNull(article)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Article> updateArticle(@PathVariable Long id, @RequestBody Article article) {
        Optional<Article> existing = articleService.getArticleById(Objects.requireNonNull(id));
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        article.setId(id);
        return ResponseEntity.ok(articleService.saveArticle(Objects.requireNonNull(article)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(Objects.requireNonNull(id));
        return ResponseEntity.ok().build();
    }
}
