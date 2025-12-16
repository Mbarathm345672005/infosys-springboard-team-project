package com.smartshelf.warehouse.repository;

import com.smartshelf.warehouse.entity.RestockSuggestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RestockSuggestionRepository extends JpaRepository<RestockSuggestion, String> {
    List<RestockSuggestion> findByPriorityOrderByAiConfidenceDesc(RestockSuggestion.Priority priority);
    List<RestockSuggestion> findAllByOrderByPriorityAscAiConfidenceDesc();
}
