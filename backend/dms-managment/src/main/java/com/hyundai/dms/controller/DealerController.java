package com.hyundai.dms.controller;

import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.service.DealerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dealers")
public class DealerController {

    private final DealerService dealerService;

    public DealerController(DealerService dealerService) {
        this.dealerService = dealerService;
    }

    // Create Dealer
    @PostMapping
    public Dealer createDealer(@RequestBody Dealer dealer) {
        return dealerService.saveDealer(dealer);
    }

    // Get All Dealers
    @GetMapping
    public List<Dealer> getAllDealers() {
        return dealerService.getAllDealers();
    }

    // Get Dealer By ID
    @GetMapping("/{id}")
    public Dealer getDealerById(@PathVariable Long id) {
        return dealerService.getDealerById(id);
    }

    // Delete Dealer
    @DeleteMapping("/{id}")
    public void deleteDealer(@PathVariable Long id) {
        dealerService.deleteDealer(id);
    }
}