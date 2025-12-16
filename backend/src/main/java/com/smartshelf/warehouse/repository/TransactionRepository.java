package com.smartshelf.warehouse.repository;

import com.smartshelf.warehouse.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
    List<Transaction> findBySkuOrderByTimestampDesc(String sku);
    List<Transaction> findByTypeOrderByTimestampDesc(Transaction.Type type);
    List<Transaction> findByTimestampBetweenOrderByTimestampDesc(LocalDateTime start, LocalDateTime end);
    List<Transaction> findAllByOrderByTimestampDesc();
}
