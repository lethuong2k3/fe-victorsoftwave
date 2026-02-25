package com.victor.softwave.controller;

import com.victor.softwave.model.PageVisit;
import com.victor.softwave.repository.PageVisitRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/analytics")
public class PublicAnalyticsController {

    @Autowired
    PageVisitRepository pageVisitRepository;

    @PostMapping("/visit")
    public ResponseEntity<?> recordVisit(@RequestParam(required = false) String pageUrl, HttpServletRequest request) {
        String ipAddress = request.getRemoteAddr();
        String userAgent = request.getHeader("User-Agent");

        // Handle proxy headers if behind Nginx/load balancer
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            ipAddress = xForwardedFor.split(",")[0].trim();
        }

        PageVisit visit = new PageVisit(pageUrl != null ? pageUrl : "unknown", ipAddress, userAgent);
        pageVisitRepository.save(visit);

        return ResponseEntity.ok(Collections.singletonMap("message", "Visit recorded"));
    }
}
