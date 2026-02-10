package com.victor.softwave.controller;

import com.victor.softwave.model.GoogleReview;
import com.victor.softwave.service.GoogleReviewService;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin/google-reviews")
@PreAuthorize("hasRole('ADMIN')")
public class AdminGoogleReviewController {

    @Autowired
    GoogleReviewService googleReviewService;

    @GetMapping
    public ResponseEntity<Page<GoogleReview>> getAllReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "time") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(googleReviewService.getAllReviews(pageable));
    }

    @PostMapping
    public ResponseEntity<GoogleReview> createReview(@RequestBody GoogleReview review) {
        return ResponseEntity.ok(googleReviewService.createReview(Objects.requireNonNull(review)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GoogleReview> updateReview(@PathVariable Long id, @RequestBody GoogleReview reviewDetails) {
        return ResponseEntity.ok(
                googleReviewService.updateReview(Objects.requireNonNull(id), Objects.requireNonNull(reviewDetails)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        googleReviewService.deleteReview(Objects.requireNonNull(id));
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/visibility")
    public ResponseEntity<GoogleReview> toggleVisibility(@PathVariable Long id) {
        return ResponseEntity.ok(googleReviewService.toggleVisibility(Objects.requireNonNull(id)));
    }
}
