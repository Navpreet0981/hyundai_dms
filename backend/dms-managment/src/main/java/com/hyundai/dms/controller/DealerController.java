package com.hyundai.dms.controller;

import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.service.DealerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

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

    @GetMapping("/paged")
    public Page<Dealer> getDealersPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "dealerId,desc") String[] sort
    ) {

        Sort sorting = Sort.by(
                sort[1].equalsIgnoreCase("asc") ?
                        Sort.Direction.ASC : Sort.Direction.DESC,
                sort[0]
        );

        Pageable pageable = PageRequest.of(page, size, sorting);

        return dealerService.getDealersPaged(search, pageable);
    }
}