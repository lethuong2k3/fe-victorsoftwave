package com.victor.softwave.controller;

import com.victor.softwave.model.Contact;
import com.victor.softwave.service.ContactService;
import org.springframework.lang.NonNull;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    @Autowired
    private ContactService contactService;

    @PostMapping
    public ResponseEntity<Contact> createContact(@Valid @RequestBody @NonNull Contact contact) {
        return ResponseEntity.ok(contactService.saveContact(contact));
    }
}
