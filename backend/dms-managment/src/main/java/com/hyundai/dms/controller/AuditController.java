package com.hyundai.dms.controller;

import com.hyundai.dms.dto.AuditLogDTO;
import com.hyundai.dms.entity.Dealer;
import com.hyundai.dms.repository.DealerRepository;
import com.hyundai.dms.service.AuditService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuditController {

    private final AuditService auditService;
    private final DealerRepository dealerRepository;

    public AuditController(AuditService auditService, DealerRepository dealerRepository) {
        this.auditService = auditService;
        this.dealerRepository = dealerRepository;
    }

    // Admin: GET /admin/audit?page=0&size=20&search=
    @GetMapping("/admin/audit")
    public Page<AuditLogDTO> getAdminAudit(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false, defaultValue = "") String search) {
        Pageable pageable = PageRequest.of(page, size);
        return auditService.getAdminLogs(search, pageable);
    }

    // Dealer: GET /dealer/audit?page=0&size=20&search=
    @GetMapping("/dealer/audit")
    public Page<AuditLogDTO> getDealerAudit(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false, defaultValue = "") String search) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Dealer dealer = dealerRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));
        Pageable pageable = PageRequest.of(page, size);
        return auditService.getDealerLogs(dealer.getDealerId(), search, pageable);
    }
}
