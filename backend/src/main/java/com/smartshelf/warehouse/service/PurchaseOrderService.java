package com.smartshelf.warehouse.service;

import com.smartshelf.warehouse.entity.PurchaseOrder;
import com.smartshelf.warehouse.repository.PurchaseOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PurchaseOrderService {

    @Autowired
    private PurchaseOrderRepository purchaseOrderRepository;

    public List<PurchaseOrder> getAllOrders() {
        return purchaseOrderRepository.findAllByOrderByCreatedAtDesc();
    }

    public PurchaseOrder getOrderById(String id) {
        return purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase order not found"));
    }

    public PurchaseOrder getOrderByPoNumber(String poNumber) {
        return purchaseOrderRepository.findByPoNumber(poNumber)
                .orElseThrow(() -> new RuntimeException("Purchase order not found"));
    }

    public PurchaseOrder createOrder(PurchaseOrder order) {
        order.setCreatedDate(LocalDate.now());
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());
        return purchaseOrderRepository.save(order);
    }

    public PurchaseOrder updateOrder(String id, PurchaseOrder orderDetails) {
        PurchaseOrder order = getOrderById(id);
        
        order.setSupplier(orderDetails.getSupplier());
        order.setItems(orderDetails.getItems());
        order.setTotalQuantity(orderDetails.getTotalQuantity());
        order.setTotalCost(orderDetails.getTotalCost());
        order.setStatus(orderDetails.getStatus());
        order.setExpectedDelivery(orderDetails.getExpectedDelivery());
        order.setNotes(orderDetails.getNotes());
        order.setUpdatedAt(LocalDateTime.now());
        
        return purchaseOrderRepository.save(order);
    }

    public PurchaseOrder updateOrderStatus(String id, String status) {
        PurchaseOrder order = getOrderById(id);
        PurchaseOrder.Status statusEnum = PurchaseOrder.Status.valueOf(status.toUpperCase());
        order.setStatus(statusEnum);
        order.setUpdatedAt(LocalDateTime.now());
        return purchaseOrderRepository.save(order);
    }

    public List<PurchaseOrder> getOrdersByStatus(String status) {
        PurchaseOrder.Status statusEnum = PurchaseOrder.Status.valueOf(status.toUpperCase());
        return purchaseOrderRepository.findByStatusOrderByCreatedAtDesc(statusEnum);
    }

    public void deleteOrder(String id) {
        PurchaseOrder order = getOrderById(id);
        purchaseOrderRepository.delete(order);
    }
}
