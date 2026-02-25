package com.victor.softwave.controller;

import com.victor.softwave.model.SeoSetting;
import com.victor.softwave.repository.SeoSettingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;

import java.util.List;

@RestController
@RequestMapping("/api/settings")
public class SeoSettingController {

    @Autowired
    SeoSettingRepository seoSettingRepository;

    @GetMapping("/seo")
    public ResponseEntity<SeoSetting> getSeoSettings() {
        List<SeoSetting> settings = seoSettingRepository.findAll();
        if (settings.isEmpty()) {
            return ResponseEntity.ok(new SeoSetting());
        }
        return ResponseEntity.ok(settings.get(0));
    }

    @PostMapping("/seo")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<SeoSetting> updateSeoSettings(@RequestBody @NonNull SeoSetting newSetting) {
        List<SeoSetting> settings = seoSettingRepository.findAll();
        if (!settings.isEmpty()) {
            SeoSetting currentSetting = settings.get(0);
            newSetting.setId(currentSetting.getId());
        }
        SeoSetting savedSetting = seoSettingRepository.save(newSetting);
        return ResponseEntity.ok(savedSetting);
    }
}
