package com.hyundai.dms.controller;

import com.hyundai.dms.dto.InventoryDTO;
import com.hyundai.dms.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dealer/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // GET /dealer/inventory — dealer sees their own inventory
    @GetMapping
    public List<InventoryDTO> getMyInventory() {
        return inventoryService.getMyInventory();
    }

    // PUT /dealer/inventory/{variantId} — set stock quantity for a variant
    // Body: { "quantity": 5 }
    @PutMapping("/{variantId}")
    public InventoryDTO updateStock(
            @PathVariable("variantId") Long variantId,
            @RequestBody Map<String, Integer> body) {
        return inventoryService.upsertStock(variantId, body.get("quantity"));
    }

    // GET /dealer/inventory/check?dealerId=1&variantId=2 — stock check (used by employee booking)
    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkStock(
            @RequestParam("dealerId") Long dealerId,
            @RequestParam("variantId") Long variantId) {
        boolean inStock = inventoryService.isInStock(dealerId, variantId);
        return ResponseEntity.ok(Map.of("inStock", inStock));
    }
}
