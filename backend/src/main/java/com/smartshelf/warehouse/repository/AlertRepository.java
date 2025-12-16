package com.smartshelf.warehouse.repository;

import com.smartshelf.warehouse.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, String> {
    List<Alert> findByIsDismissedFalseOrderByTimestampDesc();
    List<Alert> findByIsReadFalseAndIsDismissedFalseOrderByTimestampDesc();
    List<Alert> findBySeverityAndIsDismissedFalseOrderByTimestampDesc(Alert.Severity severity);
    List<Alert> findByTypeAndIsDismissedFalseOrderByTimestampDesc(Alert.Type type);
}
