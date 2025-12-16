package com.smartshelf.warehouse.controller;

import com.smartshelf.warehouse.entity.Alert;
import com.smartshelf.warehouse.service.AlertService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alerts")
public class AlertController {

    @Autowired
    private AlertService alertService;

    @GetMapping
    public ResponseEntity<List<Alert>> getAllAlerts() {
        return ResponseEntity.ok(alertService.getAllAlerts());
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Alert>> getUnreadAlerts() {
        return ResponseEntity.ok(alertService.getUnreadAlerts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Alert> getAlertById(@PathVariable String id) {
        return ResponseEntity.ok(alertService.getAlertById(id));
    }

    @GetMapping("/severity/{severity}")
    public ResponseEntity<List<Alert>> getAlertsBySeverity(@PathVariable String severity) {
        return ResponseEntity.ok(alertService.getAlertsBySeverity(severity));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Alert>> getAlertsByType(@PathVariable String type) {
        return ResponseEntity.ok(alertService.getAlertsByType(type));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_MANAGER')")
    public ResponseEntity<Alert> createAlert(@RequestBody Alert alert) {
        return ResponseEntity.ok(alertService.createAlert(alert));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Alert> markAsRead(@PathVariable String id) {
        return ResponseEntity.ok(alertService.markAsRead(id));
    }

    @PatchMapping("/{id}/dismiss")
    public ResponseEntity<Alert> dismissAlert(@PathVariable String id) {
        return ResponseEntity.ok(alertService.dismissAlert(id));
    }
}
