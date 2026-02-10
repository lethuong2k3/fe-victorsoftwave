package com.victor.softwave.service;

import com.victor.softwave.model.Contact;
import com.victor.softwave.model.ContactStatus;
import com.victor.softwave.repository.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;

import java.util.Optional;

@Service
public class ContactService {
    @Autowired
    private ContactRepository contactRepository;

    public Contact saveContact(@NonNull Contact contact) {
        return contactRepository.save(contact);
    }

    public Page<Contact> getAllContacts(int page, int size, String status, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        if (search != null && !search.isBlank()) {
            return contactRepository.findByNameContainingOrEmailContainingOrPhoneContaining(search, search, search,
                    pageable);
        }

        if (status != null && !status.isBlank()) {
            try {
                ContactStatus contactStatus = ContactStatus.valueOf(status.toUpperCase());
                return contactRepository.findByStatus(contactStatus, pageable);
            } catch (IllegalArgumentException e) {
                // Ignore invalid status
            }
        }

        return contactRepository.findAll(pageable);
    }

    public Optional<Contact> getContactById(@NonNull Long id) {
        return contactRepository.findById(id);
    }

    public void deleteContact(@NonNull Long id) {
        contactRepository.deleteById(id);
    }

    public long countUnread() {
        return contactRepository.countByStatus(ContactStatus.UNREAD);
    }
}
