package com.hyundai.dms.controller;

import com.hyundai.dms.dto.DealerRequest;
import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.entity.User;
import com.hyundai.dms.repository.UserRepository;
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
    private final UserRepository userRepository;

    public DealerController(DealerService dealerService, UserRepository userRepository) {
        this.dealerService = dealerService;
        this.userRepository = userRepository;
    }

    // POST /dealers — creates a new dealer linked to the logged-in admin
    @PostMapping
    public Dealer createDealer(@RequestBody DealerRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User adminUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        return dealerService.createDealer(request, adminUser);
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
    public Dealer deactivateDealer(@PathVariable("id") Long id) {
        return dealerService.deactivateDealer(id);
    }

    @PutMapping("/{id}/reassign")
    public void reassignAndDeactivateDealer(
            @PathVariable("id") Long oldDealerId,
            @RequestParam("targetDealerId") Long targetDealerId) {
        dealerService.reassignAndDeactivateDealer(oldDealerId, targetDealerId);
    }

    @PutMapping("/{id}/status")
    public Dealer updateDealerStatus(@PathVariable("id") Long id,
                                     @RequestBody Map<String, Boolean> body) {
        return dealerService.updateDealerStatus(id, body.get("active"));
    }

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
