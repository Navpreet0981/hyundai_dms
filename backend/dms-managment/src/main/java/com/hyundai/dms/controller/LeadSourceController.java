package com.hyundai.dms.controller;

import com.hyundai.dms.dto.LeadSourceDTO;
import com.hyundai.dms.repository.LeadSourceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class LeadSourceController {

    private final LeadSourceService leadSourceService;

    public LeadSourceController(LeadSourceService leadSourceService) {
        this.leadSourceService = leadSourceService;
    }

    @GetMapping("/lead-source-analytics")
    public List<LeadSourceDTO> getLeadSourceAnalytics() {
        return leadSourceService.getLeadSourceAnalytics();
    }
}