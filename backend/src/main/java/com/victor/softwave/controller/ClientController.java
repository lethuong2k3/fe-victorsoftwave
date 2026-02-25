package com.victor.softwave.controller;

import com.victor.softwave.model.Client;
import com.victor.softwave.service.ClientService;
import org.springframework.lang.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getClients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String cat,
            @RequestParam(required = false) String q) {

        Page<Client> result = clientService.getClientsWithFilters(page, size, cat, q);

        Map<String, Object> body = new HashMap<>();
        body.put("content", result.getContent());
        body.put("page", result.getNumber());
        body.put("size", result.getSize());
        body.put("totalElements", result.getTotalElements());
        body.put("totalPages", result.getTotalPages());
        return ResponseEntity.ok(body);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        List<String> cats = clientService.getAllCategories();
        return ResponseEntity.ok(cats);
    }

    @GetMapping("/{slug}")
    public ResponseEntity<Client> getClient(@PathVariable @NonNull String slug) {
        return clientService.getClientBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
