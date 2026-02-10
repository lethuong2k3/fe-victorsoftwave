package com.victor.softwave.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "page_visits")
@Data
@NoArgsConstructor
public class PageVisit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String pageUrl;

    private String ipAddress;

    @Column(length = 500)
    private String userAgent;

    @CreationTimestamp
    private LocalDateTime visitedAt;

    public PageVisit(String pageUrl, String ipAddress, String userAgent) {
        this.pageUrl = pageUrl;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
    }
}
