package com.victor.softwave.repository;

import com.victor.softwave.model.ClientCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientCategoryRepository extends JpaRepository<ClientCategory, Long> {
}
