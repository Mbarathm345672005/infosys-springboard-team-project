package com.smartshelf.warehouse.service;

import com.smartshelf.warehouse.entity.RestockSuggestion;
import com.smartshelf.warehouse.entity.InventoryItem;
import com.smartshelf.warehouse.repository.RestockSuggestionRepository;
import com.smartshelf.warehouse.repository.InventoryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class RestockService {

    @Autowired
    private RestockSuggestionRepository restockSuggestionRepository;

    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    public List<RestockSuggestion> getAllSuggestions() {
        return restockSuggestionRepository.findAllByOrderByPriorityAscAiConfidenceDesc();
    }

    public RestockSuggestion getSuggestionById(String id) {
        return restockSuggestionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Restock suggestion not found"));
    }

    public RestockSuggestion createSuggestion(RestockSuggestion suggestion) {
        suggestion.setGeneratedAt(LocalDateTime.now());
        
        InventoryItem item = inventoryItemRepository.findBySku(suggestion.getSku())
                .orElse(null);
        if (item != null) {
            suggestion.setInventoryItem(item);
        }
        
        return restockSuggestionRepository.save(suggestion);
    }

    public List<RestockSuggestion> getSuggestionsByPriority(String priority) {
        RestockSuggestion.Priority priorityEnum = RestockSuggestion.Priority.valueOf(priority.toUpperCase());
        return restockSuggestionRepository.findByPriorityOrderByAiConfidenceDesc(priorityEnum);
    }

    public void deleteSuggestion(String id) {
        RestockSuggestion suggestion = getSuggestionById(id);
        restockSuggestionRepository.delete(suggestion);
    }
}
