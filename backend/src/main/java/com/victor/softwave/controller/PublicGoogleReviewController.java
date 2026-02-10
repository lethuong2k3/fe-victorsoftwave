package com.victor.softwave.controller;

import com.victor.softwave.model.GoogleReview;
import com.victor.softwave.service.GoogleReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/google-reviews")
public class PublicGoogleReviewController {

    @Autowired
    private GoogleReviewService googleReviewService;

    @GetMapping
    public ResponseEntity<List<GoogleReview>> getVisibleReviews() {
        return ResponseEntity.ok(googleReviewService.getVisibleReviews());
    }
}
