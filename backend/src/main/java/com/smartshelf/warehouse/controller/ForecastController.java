package com.smartshelf.warehouse.controller;

import com.smartshelf.warehouse.entity.ForecastData;
import com.smartshelf.warehouse.service.ForecastService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/forecasts")
public class ForecastController {

    @Autowired
    private ForecastService forecastService;

    @GetMapping
    public ResponseEntity<List<ForecastData>> getAllForecasts() {
        return ResponseEntity.ok(forecastService.getAllForecasts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ForecastData> getForecastById(@PathVariable String id) {
        return ResponseEntity.ok(forecastService.getForecastById(id));
    }

    @GetMapping("/sku/{sku}")
    public ResponseEntity<ForecastData> getForecastBySku(@PathVariable String sku) {
        return ResponseEntity.ok(forecastService.getForecastBySku(sku));
    }

    @GetMapping("/risk-level/{riskLevel}")
    public ResponseEntity<List<ForecastData>> getForecastsByRiskLevel(@PathVariable String riskLevel) {
        return ResponseEntity.ok(forecastService.getForecastsByRiskLevel(riskLevel));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_MANAGER')")
    public ResponseEntity<ForecastData> createForecast(@RequestBody ForecastData forecast) {
        return ResponseEntity.ok(forecastService.createForecast(forecast));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_MANAGER')")
    public ResponseEntity<Void> deleteForecast(@PathVariable String id) {
        forecastService.deleteForecast(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/generate/{sku}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_MANAGER')")
    public ResponseEntity<ForecastData> generateMLForecast(@PathVariable String sku) {
        return ResponseEntity.ok(forecastService.generateMLForecast(sku));
    }

    @PostMapping("/generate-all")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_MANAGER')")
    public ResponseEntity<List<ForecastData>> generateAllMLForecasts() {
        return ResponseEntity.ok(forecastService.generateAllMLForecasts());
    }

    @PostMapping("/refresh/{sku}")
    @PreAuthorize("hasAnyRole('ADMIN', 'WAREHOUSE_MANAGER')")
    public ResponseEntity<ForecastData> refreshForecast(@PathVariable String sku) {
        return ResponseEntity.ok(forecastService.refreshForecast(sku));
    }
}
