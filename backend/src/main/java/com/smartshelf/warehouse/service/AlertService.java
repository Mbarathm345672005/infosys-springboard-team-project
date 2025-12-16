package com.smartshelf.warehouse.service;

import com.smartshelf.warehouse.entity.Alert;
import com.smartshelf.warehouse.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;

    public List<Alert> getAllAlerts() {
        return alertRepository.findByIsDismissedFalseOrderByTimestampDesc();
    }

    public List<Alert> getUnreadAlerts() {
        return alertRepository.findByIsReadFalseAndIsDismissedFalseOrderByTimestampDesc();
    }

    public Alert getAlertById(String id) {
        return alertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
    }

    public Alert createAlert(Alert alert) {
        alert.setTimestamp(LocalDateTime.now());
        alert.setIsRead(false);
        alert.setIsDismissed(false);
        return alertRepository.save(alert);
    }

    public Alert markAsRead(String id) {
        Alert alert = getAlertById(id);
        alert.setIsRead(true);
        return alertRepository.save(alert);
    }

    public Alert dismissAlert(String id) {
        Alert alert = getAlertById(id);
        alert.setIsDismissed(true);
        return alertRepository.save(alert);
    }

    public List<Alert> getAlertsBySeverity(String severity) {
        Alert.Severity severityEnum = Alert.Severity.valueOf(severity.toUpperCase());
        return alertRepository.findBySeverityAndIsDismissedFalseOrderByTimestampDesc(severityEnum);
    }

    public List<Alert> getAlertsByType(String type) {
        Alert.Type typeEnum = Alert.Type.valueOf(type.toUpperCase().replace(" ", "_"));
        return alertRepository.findByTypeAndIsDismissedFalseOrderByTimestampDesc(typeEnum);
    }
}
