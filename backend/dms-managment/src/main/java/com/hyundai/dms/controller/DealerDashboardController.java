package com.hyundai.dms.controller;

import com.hyundai.dms.dto.DealerDashboardDTO;
import com.hyundai.dms.repository.DealerRepository;
import com.hyundai.dms.service.DealerDashboardService;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dealer")
public class DealerDashboardController {

    private final DealerDashboardService dealerDashboardService;
    private final DealerRepository dealerRepository;

    public DealerDashboardController(DealerDashboardService dealerDashboardService,
                                     DealerRepository dealerRepository) {
        this.dealerDashboardService = dealerDashboardService;
        this.dealerRepository = dealerRepository;
    }

    // GET /dealer/dashboard — returns typed dashboard stats for the logged-in dealer
    @GetMapping("/dashboard")
    public DealerDashboardDTO getDashboard() {
        // Resolve dealer ID from JWT email in SecurityContext
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Long dealerId = dealerRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Dealer not found"))
                .getDealerId();

        // Delegate all aggregation logic to service
        return dealerDashboardService.getDealerDashboard(dealerId);
    }
}
