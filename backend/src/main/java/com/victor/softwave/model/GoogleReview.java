package com.victor.softwave.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "google_review")
@Data
@NoArgsConstructor
public class GoogleReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 255)
    private String authorName;

    @Column(length = 512)
    private String authorPhotoUrl;

    private Integer rating; // 1-5

    @Column(columnDefinition = "TEXT")
    private String text;

    @Column(length = 100)
    private String relativeTimeDescription; // e.g., "a week ago"

    private Long time; // timestamp

    @Column(columnDefinition = "boolean default true")
    private Boolean isVisible = true;

    @Column(updatable = false)
    private java.time.LocalDateTime createdAt;

    private java.time.LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
        updatedAt = java.time.LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = java.time.LocalDateTime.now();
    }
}
