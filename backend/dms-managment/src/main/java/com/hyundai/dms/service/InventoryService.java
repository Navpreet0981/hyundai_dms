package com.hyundai.dms.service;

import com.hyundai.dms.dto.InventoryDTO;
import com.hyundai.dms.entity.CarVariant;
import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.entity.Inventory;
import com.hyundai.dms.repository.CarVariantRepository;
import com.hyundai.dms.repository.DealerRepository;
import com.hyundai.dms.repository.InventoryRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final DealerRepository dealerRepository;
    private final CarVariantRepository variantRepository;

    public InventoryService(InventoryRepository inventoryRepository,
                            DealerRepository dealerRepository,
                            CarVariantRepository variantRepository) {
        this.inventoryRepository = inventoryRepository;
        this.dealerRepository = dealerRepository;
        this.variantRepository = variantRepository;
    }

    // Get inventory for the logged-in dealer
    public List<InventoryDTO> getMyInventory() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Dealer dealer = dealerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));
        return inventoryRepository.findByDealer_DealerId(dealer.getDealerId())
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Get inventory for a specific dealer (used internally)
    public List<InventoryDTO> getInventoryByDealer(Long dealerId) {
        return inventoryRepository.findByDealer_DealerId(dealerId)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    // Add or update stock for a variant
    @Transactional
    public InventoryDTO upsertStock(Long variantId, int quantity) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Dealer dealer = dealerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));

        CarVariant variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("Variant not found"));

        Inventory inventory = inventoryRepository
                .findByDealer_DealerIdAndVariant_VariantId(dealer.getDealerId(), variantId)
                .orElse(Inventory.builder().dealer(dealer).variant(variant).quantity(0).build());

        inventory.setQuantity(quantity);
        return toDTO(inventoryRepository.save(inventory));
    }

    // Check stock availability for a dealer+variant
    public boolean isInStock(Long dealerId, Long variantId) {
        return inventoryRepository
                .findByDealer_DealerIdAndVariant_VariantId(dealerId, variantId)
                .map(inv -> inv.getQuantity() > 0)
                .orElse(false);
    }

    // Decrement stock when booking is created — returns false if out of stock
    @Transactional
    public boolean decrementStock(Long dealerId, Long variantId) {
        int updated = inventoryRepository.decrementStock(dealerId, variantId);
        return updated > 0;
    }

    // Increment stock when booking is cancelled
    @Transactional
    public void incrementStock(Long dealerId, Long variantId) {
        // Only increment if inventory record exists
        inventoryRepository
                .findByDealer_DealerIdAndVariant_VariantId(dealerId, variantId)
                .ifPresent(inv -> inventoryRepository.incrementStock(dealerId, variantId));
    }

    private InventoryDTO toDTO(Inventory inv) {
        CarVariant v = inv.getVariant();
        return InventoryDTO.builder()
                .inventoryId(inv.getInventoryId())
                .dealerId(inv.getDealer().getDealerId())
                .variantId(v.getVariantId())
                .variantName(v.getVariantName())
                .engineType(v.getEngineType())
                .price(v.getPrice())
                .modelName(v.getCar() != null ? v.getCar().getModelName() : "")
                .fuelType(v.getCar() != null ? v.getCar().getFuelType() : "")
                .transmission(v.getCar() != null ? v.getCar().getTransmission() : "")
                .quantity(inv.getQuantity())
                .build();
    }
}
