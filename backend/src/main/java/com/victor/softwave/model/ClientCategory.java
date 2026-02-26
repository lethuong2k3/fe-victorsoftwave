package com.victor.softwave.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "client_categories")
public class ClientCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String nameEn;
    
    @Column(unique = true)
    private String slug;
}
