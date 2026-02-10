package com.victor.softwave.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.victor.softwave.model.SeoSetting;

@Repository
public interface SeoSettingRepository extends JpaRepository<SeoSetting, Long> {
}
