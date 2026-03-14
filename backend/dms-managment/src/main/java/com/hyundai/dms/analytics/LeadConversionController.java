package com.hyundai.dms.analytics;

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