package com.smartshelf.warehouse.service;

import com.smartshelf.warehouse.entity.Transaction;
import com.smartshelf.warehouse.entity.InventoryItem;
import com.smartshelf.warehouse.repository.TransactionRepository;
import com.smartshelf.warehouse.repository.InventoryItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private InventoryItemRepository inventoryItemRepository;

    @Autowired
    private InventoryService inventoryService;

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAllByOrderByTimestampDesc();
    }

    public Transaction getTransactionById(String id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

    public List<Transaction> getTransactionsBySku(String sku) {
        return transactionRepository.findBySkuOrderByTimestampDesc(sku);
    }

    public List<Transaction> getTransactionsByType(String type) {
        Transaction.Type typeEnum = Transaction.Type.valueOf(type.toUpperCase().replace("-", "_"));
        return transactionRepository.findByTypeOrderByTimestampDesc(typeEnum);
    }

    public Transaction createTransaction(Transaction transaction) {
        transaction.setTimestamp(LocalDateTime.now());
        
        // Update inventory quantity
        InventoryItem item = inventoryItemRepository.findBySku(transaction.getSku())
                .orElseThrow(() -> new RuntimeException("Inventory item not found"));
        
        if (transaction.getType() == Transaction.Type.STOCK_IN) {
            inventoryService.updateStock(item.getId(), transaction.getQuantity(), "add");
        } else if (transaction.getType() == Transaction.Type.STOCK_OUT) {
            inventoryService.updateStock(item.getId(), transaction.getQuantity(), "remove");
        }
        
        transaction.setInventoryItem(item);
        return transactionRepository.save(transaction);
    }

    public List<Transaction> getTransactionsByDateRange(LocalDateTime start, LocalDateTime end) {
        return transactionRepository.findByTimestampBetweenOrderByTimestampDesc(start, end);
    }
}
