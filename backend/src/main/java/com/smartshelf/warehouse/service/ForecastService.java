package com.smartshelf.warehouse.service;

import com.smartshelf.warehouse.entity.ForecastData;
import com.smartshelf.warehouse.entity.InventoryItem;
import com.smartshelf.warehouse.repository.ForecastDataRepository;
import com.smartshelf.warehouse.repository.InventoryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Service
public class ForecastService {

    @Autowired
    private ForecastDataRepository forecastDataRepository;

    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    @Autowired
    private MLForecastingService mlForecastingService;

    public List<ForecastData> getAllForecasts() {
        return forecastDataRepository.findAllByOrderByDaysUntilStockoutAsc();
    }

    public ForecastData getForecastById(String id) {
        return forecastDataRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Forecast not found"));
    }

    public ForecastData getForecastBySku(String sku) {
        return forecastDataRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Forecast not found for SKU"));
    }

    public ForecastData createForecast(ForecastData forecast) {
        forecast.setGeneratedAt(LocalDateTime.now());
        
        InventoryItem item = inventoryItemRepository.findBySku(forecast.getSku())
                .orElse(null);
        if (item != null) {
            forecast.setInventoryItem(item);
        }
        
        return forecastDataRepository.save(forecast);
    }

    public List<ForecastData> getForecastsByRiskLevel(String riskLevel) {
        ForecastData.RiskLevel riskEnum = ForecastData.RiskLevel.valueOf(riskLevel.toUpperCase());
        return forecastDataRepository.findByRiskLevelOrderByDaysUntilStockoutAsc(riskEnum);
    }

    public void deleteForecast(String id) {
        ForecastData forecast = getForecastById(id);
        forecastDataRepository.delete(forecast);
    }

    /**
     * Generate ML-based forecast for a specific product
     */
    public ForecastData generateMLForecast(String sku) {
        InventoryItem item = inventoryItemRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Inventory item not found for SKU: " + sku));
        
        ForecastData forecast = mlForecastingService.generateForecast(item);
        
        // Check if forecast already exists for this SKU
        forecastDataRepository.findBySku(sku).ifPresent(existing -> {
            forecast.setId(existing.getId());
        });
        
        return forecastDataRepository.save(forecast);
    }

    /**
     * Generate ML-based forecasts for all inventory items
     */
    public List<ForecastData> generateAllMLForecasts() {
        List<InventoryItem> items = inventoryItemRepository.findAll();
        List<ForecastData> forecasts = new ArrayList<>();
        
        for (InventoryItem item : items) {
            try {
                ForecastData forecast = mlForecastingService.generateForecast(item);
                
                // Update existing or create new
                forecastDataRepository.findBySku(item.getSku()).ifPresent(existing -> {
                    forecast.setId(existing.getId());
                });
                
                forecasts.add(forecastDataRepository.save(forecast));
            } catch (Exception e) {
                System.err.println("Failed to generate forecast for SKU: " + item.getSku() + " - " + e.getMessage());
            }
        }
        
        return forecasts;
    }

    /**
     * Refresh forecast for a specific SKU using ML
     */
    public ForecastData refreshForecast(String sku) {
        return generateMLForecast(sku);
    }
}
