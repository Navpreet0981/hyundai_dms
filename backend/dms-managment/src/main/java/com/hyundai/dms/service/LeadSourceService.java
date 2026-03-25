package com.hyundai.dms.service;

import com.hyundai.dms.dto.LeadSourceDTO;

import java.util.List;

// Fix #1: Moved from repository package to service package
public interface LeadSourceService {
    List<LeadSourceDTO> getLeadSourceAnalytics();
}
