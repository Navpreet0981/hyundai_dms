package com.hyundai.dms.controller;

import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.repository.DealerRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dealer")
public class DealerProfileController {

    private final DealerRepository dealerRepository;

    public DealerProfileController(DealerRepository dealerRepository) {
        this.dealerRepository = dealerRepository;
    }

    @GetMapping("/profile")
    public Dealer getDealerProfile() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        return dealerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));
    }
}