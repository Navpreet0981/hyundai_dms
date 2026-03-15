package com.hyundai.dms.controller;

import com.hyundai.dms.dto.LeadConversionDTO;
import com.hyundai.dms.repository.LeadConversionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class LeadConversionController {

    private final LeadConversionService leadConversionService;

    public LeadConversionController(LeadConversionService leadConversionService) {
        this.leadConversionService = leadConversionService;
    }

    @GetMapping("/lead-conversion")
    public LeadConversionDTO getLeadConversion() {
        return leadConversionService.getLeadConversionStats();
    }
}