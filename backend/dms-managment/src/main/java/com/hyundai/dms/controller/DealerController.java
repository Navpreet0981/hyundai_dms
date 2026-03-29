package com.hyundai.dms.controller;

import com.hyundai.dms.dto.DealerRequest;
import com.hyundai.dms.entity.Admin;
import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.repository.AdminRepository;
import com.hyundai.dms.service.DealerService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dealers")
public class DealerController {

    private final DealerService dealerService;
    private final AdminRepository adminRepository;

    public DealerController(DealerService dealerService, AdminRepository adminRepository) {
        this.dealerService = dealerService;
        this.adminRepository = adminRepository;
    }

    // POST /dealers — creates a new dealer linked to the logged-in admin
    @PostMapping
    public Dealer createDealer(@RequestBody DealerRequest request) {
        // Resolve logged-in admin from JWT to link dealer ownership
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
        dealer.setPassword(request.getPassword()); // raw — service encodes it
        dealer.setActive(request.getActive() != null ? request.getActive() : true);
        dealer.setAdmin(admin);

        // saveDealer encodes the password before persisting
        return dealerService.saveDealer(dealer);
    }

    // GET /dealers — returns all dealers (admin sees all)
    @GetMapping
    public List<Dealer> getAllDealers() {
        return dealerService.getAllDealers();
    }

    // GET /dealers/{id} — returns single dealer by ID
    @GetMapping("/{id}")
    public Dealer getDealerById(@PathVariable("id") Long id) {
        return dealerService.getDealerById(id);
    }

    // DELETE /dealers/{id} — soft deactivates dealer (sets active=false, preserves all data)
    @DeleteMapping("/{id}")
    public Dealer deactivateDealer(@PathVariable("id") Long id) {
        return dealerService.deactivateDealer(id);
    }

    // PUT /dealers/{id}/reassign — bulk-reassigns all dealer data to target, then soft-deactivates old dealer
    @PutMapping("/{id}/reassign")
    public void reassignAndDeactivateDealer(
            @PathVariable("id") Long oldDealerId,
            @RequestParam("targetDealerId") Long targetDealerId) {
        dealerService.reassignAndDeactivateDealer(oldDealerId, targetDealerId);
    }

    // PUT /dealers/{id}/status — toggles dealer active/inactive status
    @PutMapping("/{id}/status")
    public Dealer updateDealerStatus(@PathVariable("id") Long id,
                                     @RequestBody Map<String, Boolean> body) {
        return dealerService.updateDealerStatus(id, body.get("active"));
    }

    // GET /dealers/paged — paginated + searchable dealer list with dynamic sort
    @GetMapping("/paged")
    public Page<Dealer> getDealersPaged(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "sort", defaultValue = "dealerId,desc") String[] sort) {

        Sort sorting = Sort.by(
                sort[1].equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,
                sort[0]);
        Pageable pageable = PageRequest.of(page, size, sorting);
        return dealerService.getDealersPaged(search, pageable);
    }
}
