package com.victor.softwave.service;

import com.victor.softwave.model.Client;
import com.victor.softwave.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;

import java.util.List;
import java.util.Optional;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    public Page<Client> getClientsWithFilters(int page, int size, String category, String q) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
        if (category != null && category.isEmpty())
            category = null;
        if (q != null && q.isEmpty())
            q = null;
        return clientRepository.findWithFilters(category, q, pageable);
    }

    public List<String> getAllCategories() {
        return clientRepository.findDistinctCategories();
    }

    public Optional<Client> getClientById(@NonNull Long id) {
        return clientRepository.findById(id);
    }

    public Optional<Client> getClientBySlug(@NonNull String slug) {
        return clientRepository.findBySlug(slug);
    }

    public Client saveClient(@NonNull Client client) {
        return clientRepository.save(client);
    }

    public void deleteClient(@NonNull Long id) {
        clientRepository.deleteById(id);
    }
}
