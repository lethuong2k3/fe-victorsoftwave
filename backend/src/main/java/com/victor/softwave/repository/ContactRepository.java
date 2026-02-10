package com.victor.softwave.repository;

import com.victor.softwave.model.Contact;
import com.victor.softwave.model.ContactStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    Page<Contact> findByNameContainingOrEmailContainingOrPhoneContaining(String name, String email, String phone,
            Pageable pageable);

    Page<Contact> findByStatus(ContactStatus status, Pageable pageable);

    long countByStatus(ContactStatus status);
}
