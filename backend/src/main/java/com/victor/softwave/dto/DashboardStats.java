package com.victor.softwave.dto;

import lombok.Data;

@Data
public class DashboardStats {
    private long totalProjects;
    private long totalArticles;
    private long totalContacts;
    private long unreadContacts;
    private long totalClients;
    private long totalVisits;
}
