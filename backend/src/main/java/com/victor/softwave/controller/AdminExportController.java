package com.victor.softwave.controller;

import com.victor.softwave.model.Client;
import com.victor.softwave.model.Project;
import com.victor.softwave.payload.request.QuoteRequest;
import com.victor.softwave.repository.ClientRepository;
import com.victor.softwave.repository.ProjectRepository;
import com.victor.softwave.service.ExcelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/admin/export")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminExportController {

        @Autowired
        private ExcelService excelService;

        @Autowired
        private ProjectRepository projectRepository;

        @Autowired
        private ClientRepository clientRepository;

        @GetMapping("/clients")
        public ResponseEntity<InputStreamResource> exportClients() {
                List<Client> clients = clientRepository.findAll();
                ByteArrayInputStream in = excelService.exportClientsToExcel(clients);

                HttpHeaders headers = new HttpHeaders();
                headers.add("Content-Disposition", "attachment; filename=clients.xlsx");

                return ResponseEntity.ok()
                                .headers(headers)
                                .contentType(
                                                MediaType.parseMediaType(
                                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                                .body(new InputStreamResource(Objects.requireNonNull(in)));
        }

        @GetMapping("/projects")
        public ResponseEntity<InputStreamResource> exportProjects() {
                List<Project> projects = projectRepository.findAll();
                ByteArrayInputStream in = excelService.exportProjectsToExcel(projects);

                HttpHeaders headers = new HttpHeaders();
                headers.add("Content-Disposition", "attachment; filename=projects.xlsx");

                return ResponseEntity.ok()
                                .headers(headers)
                                .contentType(
                                                MediaType.parseMediaType(
                                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                                .body(new InputStreamResource(Objects.requireNonNull(in)));
        }

        @PostMapping("/quote")
        public ResponseEntity<InputStreamResource> exportQuote(@RequestBody QuoteRequest request) {
                ByteArrayInputStream in = excelService.generateQuote(Objects.requireNonNull(request));

                HttpHeaders headers = new HttpHeaders();
                headers.add("Content-Disposition", "attachment; filename=quote.xlsx");

                return ResponseEntity.ok()
                                .headers(headers)
                                .contentType(
                                                MediaType.parseMediaType(
                                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                                .body(new InputStreamResource(Objects.requireNonNull(in)));
        }

        @PostMapping("/projects")
        public ResponseEntity<InputStreamResource> exportSelectedProjects(@RequestBody List<Long> ids) {
                List<Project> projects = new ArrayList<>();
                if (ids != null && !ids.isEmpty()) {
                        projects = projectRepository.findAllById(ids);
                } else {
                        projects = projectRepository.findAll();
                }
                ByteArrayInputStream in = excelService.exportProjectsToExcel(projects);

                HttpHeaders headers = new HttpHeaders();
                headers.add("Content-Disposition", "attachment; filename=projects_selected.xlsx");

                return ResponseEntity.ok()
                                .headers(headers)
                                .contentType(
                                                MediaType.parseMediaType(
                                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                                .body(new InputStreamResource(Objects.requireNonNull(in)));
        }
}
