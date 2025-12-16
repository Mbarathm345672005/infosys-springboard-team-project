package com.smartshelf.warehouse.repository;

import com.smartshelf.warehouse.entity.ForecastData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ForecastDataRepository extends JpaRepository<ForecastData, String> {
    Optional<ForecastData> findBySku(String sku);
    List<ForecastData> findByRiskLevelOrderByDaysUntilStockoutAsc(ForecastData.RiskLevel riskLevel);
    List<ForecastData> findAllByOrderByDaysUntilStockoutAsc();
}
