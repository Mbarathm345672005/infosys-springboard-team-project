package com.smartshelf.warehouse.repository;

import com.smartshelf.warehouse.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, String> {
    Optional<PurchaseOrder> findByPoNumber(String poNumber);
    List<PurchaseOrder> findByStatusOrderByCreatedAtDesc(PurchaseOrder.Status status);
    List<PurchaseOrder> findAllByOrderByCreatedAtDesc();
}
