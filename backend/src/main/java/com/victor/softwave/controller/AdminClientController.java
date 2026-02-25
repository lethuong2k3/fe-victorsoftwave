package com.victor.softwave.controller;

import com.victor.softwave.model.Client;
import com.victor.softwave.service.ClientService;
import java.util.Objects;
import org.springframework.lang.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/clients")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminClientController {

    @Autowired
    private ClientService clientService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getClients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
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

    @PostMapping
    public ResponseEntity<Client> createClient(@RequestBody @NonNull Client client) {
        client.setId(null);
        Client saved = clientService.saveClient(client);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Long id, @RequestBody Client client) {
        return clientService.getClientById(Objects.requireNonNull(id))
                .map(existing -> {
                    client.setId(existing.getId());
                    Client saved = clientService.saveClient(client);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable @NonNull Long id) {
        if (clientService.getClientById(Objects.requireNonNull(id)).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
}
