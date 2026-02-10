package com.victor.softwave.repository;

import com.victor.softwave.model.GoogleReview;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoogleReviewRepository extends JpaRepository<GoogleReview, Long> {
    @NonNull
    Page<GoogleReview> findAll(@NonNull Pageable pageable);

    List<GoogleReview> findByIsVisibleTrueOrderByTimeDesc();
}
