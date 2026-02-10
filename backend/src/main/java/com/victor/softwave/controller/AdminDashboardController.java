package com.victor.softwave.controller;

import com.victor.softwave.dto.DashboardStats;
import com.victor.softwave.dto.VisitPoint;
import com.victor.softwave.model.ContactStatus;
import com.victor.softwave.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private ArticleRepository articleRepository;
    @Autowired
    private ContactRepository contactRepository;
    @Autowired
    private ClientRepository clientRepository;
    @Autowired
    private PageVisitRepository pageVisitRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getStats(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        DashboardStats stats = new DashboardStats();
        stats.setTotalProjects(projectRepository.count());
        stats.setTotalArticles(articleRepository.count());
        stats.setTotalContacts(contactRepository.count());
        stats.setUnreadContacts(contactRepository.countByStatus(ContactStatus.UNREAD));
        stats.setTotalClients(clientRepository.count());

        if (startDate != null && endDate != null) {
            LocalDateTime start = startDate.atStartOfDay();
            LocalDateTime end = endDate.atTime(LocalTime.MAX);
            stats.setTotalVisits(pageVisitRepository.countByVisitedAtBetween(start, end));
        } else {
            stats.setTotalVisits(pageVisitRepository.count());
        }

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/visits-series")
    public ResponseEntity<List<VisitPoint>> getVisitSeries(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        LocalDate start = startDate;
        LocalDate end = endDate;

        if (start == null || end == null) {
            end = LocalDate.now();
            start = end.minusDays(29);
        }

        List<VisitPoint> series = new ArrayList<>();
        LocalDate cursor = start;
        while (!cursor.isAfter(end)) {
            LocalDateTime dayStart = cursor.atStartOfDay();
            LocalDateTime dayEnd = cursor.atTime(LocalTime.MAX);
            long count = pageVisitRepository.countByVisitedAtBetween(dayStart, dayEnd);
            series.add(new VisitPoint(cursor, count));
            cursor = cursor.plusDays(1);
        }

        return ResponseEntity.ok(series);
    }
}
