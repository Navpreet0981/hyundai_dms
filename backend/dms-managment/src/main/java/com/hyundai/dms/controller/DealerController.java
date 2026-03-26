package com.hyundai.dms.controller;

import com.hyundai.dms.dto.DealerRequest;
import com.hyundai.dms.entity.Admin;
import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.repository.AdminRepository;
import com.hyundai.dms.service.DealerService;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final AdminRepository adminRepository;

    public DealerController(DealerService dealerService, AdminRepository adminRepository) {
        this.dealerService = dealerService;
        this.adminRepository = adminRepository;
    }

    @PostMapping
    public Dealer createDealer(@RequestBody DealerRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        Dealer dealer = new Dealer();
        dealer.setDealerName(request.getDealerName());
        dealer.setEmail(request.getEmail());
        dealer.setPhone(request.getPhone());
        dealer.setCity(request.getCity());
        dealer.setState(request.getState());
        dealer.setAddress(request.getAddress());
        // FIX: Pass password to service - it will encode it
        dealer.setPassword(request.getPassword());
        dealer.setActive(request.getActive() != null ? request.getActive() : true);
        dealer.setAdmin(admin);
        // FIX: Call saveDealer which ENCODES the password
        return dealerService.saveDealer(dealer);
    }

    @GetMapping
    public List<Dealer> getAllDealers() {
        return dealerService.getAllDealers();
    }

    @GetMapping("/{id}")
    public Dealer getDealerById(@PathVariable("id") Long id) {
        return dealerService.getDealerById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteDealer(@PathVariable("id") Long id) {
        dealerService.deleteDealer(id);
    }

    @PutMapping("/{id}/reassign")
    public void reassignAndDeleteDealer(
            @PathVariable("id") Long oldDealerId,
            @RequestParam("targetDealerId") Long targetDealerId) {
        dealerService.reassignAndDeleteDealer(oldDealerId, targetDealerId);
    }

    // Fix #8: Added missing endpoint called by DealerPerformance.jsx toggleDealer
    @PutMapping("/{id}/status")
    public Dealer updateDealerStatus(@PathVariable("id") Long id, @RequestBody java.util.Map<String, Boolean> body) {
        return dealerService.updateDealerStatus(id, body.get("active"));
    }

    @GetMapping("/paged")
    public Page<Dealer> getDealersPaged(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "sort", defaultValue = "dealerId,desc") String[] sort
    ) {
        Sort sorting = Sort.by(
                sort[1].equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,
                sort[0]
        );
        Pageable pageable = PageRequest.of(page, size, sorting);
        return dealerService.getDealersPaged(search, pageable);
    }
}