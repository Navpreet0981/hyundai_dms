package com.hyundai.dms.repository;

import com.hyundai.dms.dto.LeadSourceDTO;

import java.util.List;

public interface LeadSourceService {

    List<LeadSourceDTO> getLeadSourceAnalytics();

}