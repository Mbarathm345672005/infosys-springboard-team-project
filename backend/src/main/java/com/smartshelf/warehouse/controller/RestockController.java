package com.smartshelf.warehouse.controller;

import com.smartshelf.warehouse.entity.RestockSuggestion;
import com.smartshelf.warehouse.service.RestockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/restock-suggestions")
public class RestockController {

    @Autowired
    private RestockService restockService;

    @GetMapping
    public ResponseEntity<List<RestockSuggestion>> getAllSuggestions() {
        return ResponseEntity.ok(restockService.getAllSuggestions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestockSuggestion> getSuggestionById(@PathVariable String id) {
        return ResponseEntity.ok(restockService.getSuggestionById(id));
    }

    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<RestockSuggestion>> getSuggestionsByPriority(@PathVariable String priority) {
        return ResponseEntity.ok(restockService.getSuggestionsByPriority(priority));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_MANAGER')")
    public ResponseEntity<RestockSuggestion> createSuggestion(@RequestBody RestockSuggestion suggestion) {
        return ResponseEntity.ok(restockService.createSuggestion(suggestion));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_MANAGER')")
    public ResponseEntity<Void> deleteSuggestion(@PathVariable String id) {
        restockService.deleteSuggestion(id);
        return ResponseEntity.noContent().build();
    }
}
