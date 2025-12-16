package com.smartshelf.warehouse.service;

import com.smartshelf.warehouse.entity.ForecastData;
import com.smartshelf.warehouse.entity.InventoryItem;
import com.smartshelf.warehouse.entity.Transaction;
import com.smartshelf.warehouse.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Machine Learning Forecasting Service
 * Uses Exponential Smoothing with Linear Regression for inventory demand prediction
 */
@Service
public class MLForecastingService {

    @Autowired
    private TransactionRepository transactionRepository;

    // Exponential smoothing parameters
    private static final double ALPHA = 0.3; // Smoothing factor for level
    private static final double BETA = 0.2;  // Smoothing factor for trend
    private static final int MIN_DATA_POINTS = 7; // Minimum days of data needed
    private static final int FORECAST_DAYS = 30; // Number of days to forecast

    /**
     * Generate forecast for an inventory item using ML prediction
     */
    public ForecastData generateForecast(InventoryItem item) {
        ForecastData forecast = new ForecastData();
        forecast.setSku(item.getSku());
        forecast.setProductName(item.getName());
        forecast.setCurrentStock(item.getQuantity());
        forecast.setInventoryItem(item);
        forecast.setGeneratedAt(LocalDateTime.now());

        // Get historical transaction data
        List<Transaction> transactions = getRecentTransactions(item.getSku(), 90); // Last 90 days
        
        if (transactions.isEmpty() || transactions.size() < MIN_DATA_POINTS) {
            // Use simple baseline if insufficient data
            return generateBaselineForecast(item, forecast);
        }

        // Calculate daily demand using exponential smoothing
        Map<LocalDate, Integer> dailyDemand = aggregateDailyDemand(transactions);
        DemandPrediction prediction = predictDemand(dailyDemand);

        // Set forecast values
        forecast.setPredictedDemand((int) Math.round(prediction.averageDailyDemand));
        forecast.setConfidenceScore(prediction.confidenceScore);

        // Calculate days until stockout
        int daysUntilStockout = calculateDaysUntilStockout(
            item.getQuantity(), 
            prediction.averageDailyDemand
        );
        forecast.setDaysUntilStockout(daysUntilStockout);

        // Calculate reorder point (safety stock + lead time demand)
        int leadTimeDays = 7; // Assumed lead time
        int safetyStock = (int) Math.ceil(prediction.averageDailyDemand * 3); // 3 days buffer
        int reorderPoint = (int) Math.ceil(prediction.averageDailyDemand * leadTimeDays) + safetyStock;
        forecast.setReorderPoint(reorderPoint);

        // Set suggested order quantity (Economic Order Quantity approximation)
        int suggestedOrder = Math.max(
            item.getMaxStock() - item.getQuantity(),
            (int) Math.ceil(prediction.averageDailyDemand * 30) // 30 days worth
        );
        forecast.setSuggestedOrderQuantity(suggestedOrder);

        // Determine risk level
        forecast.setRiskLevel(calculateRiskLevel(
            item.getQuantity(), 
            reorderPoint, 
            daysUntilStockout
        ));

        // Set algorithm used
        forecast.setAlgorithm("Exponential Smoothing + Linear Regression");

        return forecast;
    }

    /**
     * Get recent transactions for a product
     */
    private List<Transaction> getRecentTransactions(String sku, int days) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        return transactionRepository.findAll().stream()
            .filter(t -> t.getSku() != null && t.getSku().equals(sku))
            .filter(t -> t.getTimestamp().isAfter(startDate))
            .filter(t -> "SALE".equals(t.getType()) || "OUTBOUND".equals(t.getType()))
            .sorted(Comparator.comparing(Transaction::getTimestamp))
            .collect(Collectors.toList());
    }

    /**
     * Aggregate transactions into daily demand
     */
    private Map<LocalDate, Integer> aggregateDailyDemand(List<Transaction> transactions) {
        Map<LocalDate, Integer> dailyDemand = new TreeMap<>();
        
        for (Transaction transaction : transactions) {
            LocalDate date = transaction.getTimestamp().toLocalDate();
            int quantity = Math.abs(transaction.getQuantity()); // Use absolute value
            dailyDemand.merge(date, quantity, Integer::sum);
        }
        
        return dailyDemand;
    }

    /**
     * Predict future demand using Exponential Smoothing with trend (Holt's method)
     */
    private DemandPrediction predictDemand(Map<LocalDate, Integer> dailyDemand) {
        if (dailyDemand.isEmpty()) {
            return new DemandPrediction(0.0, 0.0);
        }

        List<Integer> demands = new ArrayList<>(dailyDemand.values());
        
        // Initialize level and trend
        double level = demands.get(0);
        double trend = 0.0;
        
        if (demands.size() > 1) {
            trend = demands.get(1) - demands.get(0);
        }

        // Apply exponential smoothing
        for (int i = 1; i < demands.size(); i++) {
            double newLevel = ALPHA * demands.get(i) + (1 - ALPHA) * (level + trend);
            double newTrend = BETA * (newLevel - level) + (1 - BETA) * trend;
            
            level = newLevel;
            trend = newTrend;
        }

        // Forecast average daily demand
        double forecastedDemand = Math.max(0, level + trend);
        
        // Calculate confidence based on data consistency
        double confidence = calculateConfidence(demands, forecastedDemand);

        return new DemandPrediction(forecastedDemand, confidence);
    }

    /**
     * Calculate confidence score based on data variance
     */
    private double calculateConfidence(List<Integer> demands, double predicted) {
        if (demands.size() < 2) {
            return 50.0; // Low confidence with insufficient data
        }

        // Calculate mean and standard deviation
        double mean = demands.stream().mapToInt(Integer::intValue).average().orElse(0.0);
        double variance = demands.stream()
            .mapToDouble(d -> Math.pow(d - mean, 2))
            .average()
            .orElse(0.0);
        double stdDev = Math.sqrt(variance);

        // Calculate coefficient of variation (CV)
        double cv = mean > 0 ? (stdDev / mean) : 1.0;

        // Convert to confidence score (lower CV = higher confidence)
        // CV < 0.2 = high confidence, CV > 1.0 = low confidence
        double confidence = Math.max(0, Math.min(100, 100 - (cv * 50)));

        // Adjust confidence based on data points
        double dataPointsFactor = Math.min(1.0, demands.size() / 30.0);
        confidence *= (0.7 + 0.3 * dataPointsFactor);

        return Math.round(confidence);
    }

    /**
     * Calculate days until stockout
     */
    private int calculateDaysUntilStockout(int currentStock, double averageDailyDemand) {
        if (averageDailyDemand <= 0) {
            return 999; // No consumption detected
        }
        
        return (int) Math.floor(currentStock / averageDailyDemand);
    }

    /**
     * Determine risk level based on stock and reorder point
     */
    private ForecastData.RiskLevel calculateRiskLevel(int currentStock, int reorderPoint, int daysUntilStockout) {
        if (currentStock <= 0 || daysUntilStockout <= 0) {
            return ForecastData.RiskLevel.CRITICAL;
        } else if (currentStock <= reorderPoint * 0.5 || daysUntilStockout <= 3) {
            return ForecastData.RiskLevel.HIGH;
        } else if (currentStock <= reorderPoint || daysUntilStockout <= 7) {
            return ForecastData.RiskLevel.MEDIUM;
        } else {
            return ForecastData.RiskLevel.LOW;
        }
    }

    /**
     * Generate baseline forecast when insufficient data
     */
    private ForecastData generateBaselineForecast(InventoryItem item, ForecastData forecast) {
        // Use simple heuristics
        double estimatedDailyDemand = (item.getMinStock() + item.getMaxStock()) / 60.0; // Assume 2-month turnover
        
        forecast.setPredictedDemand((int) Math.ceil(estimatedDailyDemand));
        forecast.setConfidenceScore(30.0); // Low confidence
        
        int daysUntilStockout = calculateDaysUntilStockout(item.getQuantity(), estimatedDailyDemand);
        forecast.setDaysUntilStockout(daysUntilStockout);
        
        forecast.setReorderPoint(item.getMinStock());
        forecast.setSuggestedOrderQuantity(item.getMaxStock() - item.getQuantity());
        forecast.setRiskLevel(calculateRiskLevel(
            item.getQuantity(), 
            item.getMinStock(), 
            daysUntilStockout
        ));
        forecast.setAlgorithm("Baseline (Insufficient Data)");
        
        return forecast;
    }

    /**
     * Inner class to hold prediction results
     */
    private static class DemandPrediction {
        double averageDailyDemand;
        double confidenceScore;

        DemandPrediction(double averageDailyDemand, double confidenceScore) {
            this.averageDailyDemand = averageDailyDemand;
            this.confidenceScore = confidenceScore;
        }
    }
}
