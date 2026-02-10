package com.victor.softwave.service;

import com.victor.softwave.model.Article;
import com.victor.softwave.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;

import java.util.Optional;

@Service
public class ArticleService {
    @Autowired
    private ArticleRepository articleRepository;

    public Page<Article> getArticles(String status, String category, Boolean featured, String search,
            @NonNull Pageable pageable) {
        return articleRepository.findWithFilters(status, category, featured, search, pageable);
    }

    public Article saveArticle(@NonNull Article article) {
        return articleRepository.save(article);
    }

    public Optional<Article> getArticleById(@NonNull Long id) {
        return articleRepository.findById(id);
    }

    public Optional<Article> getArticleBySlug(@NonNull String slug) {
        return articleRepository.findBySlug(slug);
    }

    public Optional<Article> getArticleBySlugEn(@NonNull String slugEn) {
        return articleRepository.findBySlugEn(slugEn);
    }

    public void deleteArticle(@NonNull Long id) {
        articleRepository.deleteById(id);
    }
}
