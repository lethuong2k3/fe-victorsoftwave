package com.victor.softwave.service;

import com.victor.softwave.model.GoogleReview;
import com.victor.softwave.repository.GoogleReviewRepository;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;

import java.util.List;

@Service
public class GoogleReviewService {

    @Autowired
    private GoogleReviewRepository googleReviewRepository;

    public Page<GoogleReview> getAllReviews(@NonNull Pageable pageable) {
        return googleReviewRepository.findAll(pageable);
    }

    public List<GoogleReview> getVisibleReviews() {
        return googleReviewRepository.findByIsVisibleTrueOrderByTimeDesc();
    }

    public GoogleReview createReview(@NonNull GoogleReview review) {
        return googleReviewRepository.save(review);
    }

    public GoogleReview updateReview(@NonNull Long id, @NonNull GoogleReview reviewDetails) {
        GoogleReview review = googleReviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));

        review.setAuthorName(reviewDetails.getAuthorName());
        review.setAuthorPhotoUrl(reviewDetails.getAuthorPhotoUrl());
        review.setRating(reviewDetails.getRating());
        review.setText(reviewDetails.getText());
        review.setRelativeTimeDescription(reviewDetails.getRelativeTimeDescription());
        review.setTime(reviewDetails.getTime());
        review.setIsVisible(reviewDetails.getIsVisible());

        return googleReviewRepository.save(review);
    }

    public void deleteReview(@NonNull Long id) {
        GoogleReview review = googleReviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));
        googleReviewRepository.delete(Objects.requireNonNull(review));
    }

    public GoogleReview toggleVisibility(@NonNull Long id) {
        GoogleReview review = googleReviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));

        review.setIsVisible(!review.getIsVisible());
        return googleReviewRepository.save(review);
    }
}
