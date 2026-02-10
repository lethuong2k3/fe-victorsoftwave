package com.victor.softwave.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "clients")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Client {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String logo;
    private String link;
    private Integer displayOrder;

    private String category;

    @Column(unique = true)
    private String slug;

    private String status; // PUBLISHED, DRAFT
    private String priority; // HIGH, MEDIUM, LOW
    private Boolean featured;
}
