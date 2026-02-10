package com.victor.softwave.controller;

import com.victor.softwave.model.Contact;
import com.victor.softwave.model.ContactStatus;
import com.victor.softwave.service.ContactService;
import org.springframework.lang.NonNull;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/contacts")
@PreAuthorize("hasRole('ADMIN')")
public class AdminContactController {

    @Autowired
    private ContactService contactService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getContacts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {

        Page<Contact> result = contactService.getAllContacts(page, size, status, search);

        Map<String, Object> body = new HashMap<>();
        body.put("content", result.getContent());
        body.put("page", result.getNumber());
        body.put("size", result.getSize());
        body.put("totalElements", result.getTotalElements());
        body.put("totalPages", result.getTotalPages());
        return ResponseEntity.ok(body);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Contact> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String statusStr = payload.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().build();
        }

        return contactService.getContactById(Objects.requireNonNull(id))
                .map(contact -> {
                    try {
                        contact.setStatus(ContactStatus.valueOf(statusStr.toUpperCase()));
                        return ResponseEntity.ok(contactService.saveContact(contact));
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().<Contact>build();
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable @NonNull Long id) {
        contactService.deleteContact(Objects.requireNonNull(id));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        return ResponseEntity.ok(Map.of("count", contactService.countUnread()));
    }
}
